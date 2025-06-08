
provider "aws" {
  region = "eu-west-3"  # France (Paris)
}

# VPC
resource "aws_vpc" "education_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = {
    Name = "education-vpc"
    Project = "education-platform"
  }
}

# Subnets
resource "aws_subnet" "public_subnet_1" {
  vpc_id     = aws_vpc.education_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "eu-west-3a"
  map_public_ip_on_launch = true
  tags = {
    Name = "education-public-subnet-1"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id     = aws_vpc.education_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "eu-west-3b"
  map_public_ip_on_launch = true
  tags = {
    Name = "education-public-subnet-2"
  }
}

resource "aws_subnet" "private_subnet_1" {
  vpc_id     = aws_vpc.education_vpc.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "eu-west-3a"
  tags = {
    Name = "education-private-subnet-1"
  }
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id     = aws_vpc.education_vpc.id
  cidr_block = "10.0.4.0/24"
  availability_zone = "eu-west-3b"
  tags = {
    Name = "education-private-subnet-2"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "education_igw" {
  vpc_id = aws_vpc.education_vpc.id
  tags = {
    Name = "education-igw"
  }
}

# Route Tables
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.education_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.education_igw.id
  }
  tags = {
    Name = "education-public-rt"
  }
}

# Route Table Associations
resource "aws_route_table_association" "public_rta_1" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_rta_2" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_rt.id
}

# EKS Cluster
resource "aws_eks_cluster" "education_cluster" {
  name     = "education-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  
  vpc_config {
    subnet_ids = [
      aws_subnet.public_subnet_1.id,
      aws_subnet.public_subnet_2.id,
      aws_subnet.private_subnet_1.id,
      aws_subnet.private_subnet_2.id
    ]
  }
  
  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]
}

# IAM Role for EKS Cluster
resource "aws_iam_role" "eks_cluster_role" {
  name = "eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

# EKS Node Group
resource "aws_eks_node_group" "education_node_group" {
  cluster_name    = aws_eks_cluster.education_cluster.name
  node_group_name = "education-node-group"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = [
    aws_subnet.private_subnet_1.id,
    aws_subnet.private_subnet_2.id
  ]

  scaling_config {
    desired_size = 2
    max_size     = 3
    min_size     = 1
  }

  instance_types = ["t3.medium"]

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.ec2_container_registry_readonly,
  ]
}

# IAM Role for EKS Node Group
resource "aws_iam_role" "eks_node_role" {
  name = "eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "ec2_container_registry_readonly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_role.name
}

# RDS PostgreSQL Database
resource "aws_db_instance" "education_db" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "15.3"
  instance_class       = "db.t3.micro"
  identifier           = "education-db"
  db_name              = "education"
  username             = "postgres"
  password             = "postgres" # Utiliser AWS Secrets Manager en production
  parameter_group_name = "default.postgres15"
  skip_final_snapshot  = true
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.education_db_subnet.name
}

# DB Subnet Group
resource "aws_db_subnet_group" "education_db_subnet" {
  name       = "education-db-subnet"
  subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]

  tags = {
    Name = "Education DB subnet group"
  }
}

# Security Group for RDS
resource "aws_security_group" "rds_sg" {
  name        = "education-rds-sg"
  description = "Allow PostgreSQL inbound traffic"
  vpc_id      = aws_vpc.education_vpc.id

  ingress {
    description = "PostgreSQL"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.education_vpc.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "education-rds-sg"
  }
}

# Outputs
output "eks_cluster_endpoint" {
  value = aws_eks_cluster.education_cluster.endpoint
}

output "rds_hostname" {
  value = aws_db_instance.education_db.address
}

output "rds_port" {
  value = aws_db_instance.education_db.port
}

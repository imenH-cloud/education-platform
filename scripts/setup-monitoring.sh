
#!/bin/bash

# Créer un namespace pour le monitoring
kubectl create namespace monitoring

# Ajouter le repo Helm pour Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Installer Prometheus
helm install prometheus prometheus-community/prometheus \
  --namespace monitoring \
  --set server.persistentVolume.size=8Gi \
  --set alertmanager.persistentVolume.size=

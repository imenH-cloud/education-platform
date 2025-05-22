import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Parent } from '../../parent/entities/parent.entity';
import { Classroom } from '../../classroom/entities/classroom.entity';

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstName: string;
    @Column()
     numeroInscriptio:string
    @Column()
    lastName: string;
    @Column({ unique: true })
    email: string;

    @Column()
    dateOfBirth: Date;

    @Column()
    phoneNumber: string;

    @Column()
    address: string;

    @Column({ default: true })
    isActive: boolean;
// @Column()
// TypeOfDisability 
    @Column()
    enrollmentDate: Date;

    @ManyToOne(() => Parent, parent => parent.students)
    parent: Parent;

    @ManyToOne(() => Classroom, classroom => classroom.students)
    classroom: Classroom;
}

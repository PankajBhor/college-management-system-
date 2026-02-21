package com.college.colllege_backend.entity;

import com.college.colllege_backend.enums.FeeStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "fees")
public class Fees {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    @NotNull(message = "Student cannot be null")
    private Student student;

    @NotNull(message = "Amount cannot be null")
    private Double amount;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeeStatus status = FeeStatus.PENDING; // PENDING, PAID, OVERDUE

    private String remarks;

    // Constructors
    public Fees() {}

    public Fees(Student student, Double amount, LocalDate dueDate) {
        this.student = student;
        this.amount = amount;
        this.dueDate = dueDate;
        this.status = FeeStatus.PENDING;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getPaidDate() {
        return paidDate;
    }

    public void setPaidDate(LocalDate paidDate) {
        this.paidDate = paidDate;
    }

    public FeeStatus getStatus() {
        return status;
    }

    public void setStatus(FeeStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}

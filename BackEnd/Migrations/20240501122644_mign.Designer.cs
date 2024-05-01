﻿// <auto-generated />
using System;
using BackEnd.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BackEnd.Migrations
{
    [DbContext(typeof(LithubContext))]
    [Migration("20240501122644_mign")]
    partial class mign
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.16")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("BackEnd.Models.Comment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Author")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int?>("CommentId")
                        .HasColumnType("int");

                    b.Property<int?>("ParentCommentId")
                        .HasColumnType("int");

                    b.Property<DateTime>("PostedDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("ProblemId")
                        .HasColumnType("int");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("CommentId");

                    b.ToTable("Comment");
                });

            modelBuilder.Entity("BackEnd.Models.Like", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("commentId")
                        .HasColumnType("int");

                    b.Property<int>("problemId")
                        .HasColumnType("int");

                    b.Property<string>("role")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("userName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Like");
                });

            modelBuilder.Entity("BackEnd.Models.Marked", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("problemId")
                        .HasColumnType("int");

                    b.Property<string>("userName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Marked");
                });

            modelBuilder.Entity("BackEnd.Models.Problem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<bool?>("IsClosed")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool?>("IsPrivate")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Languages")
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("Link")
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("Source")
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<int?>("SourceId")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<DateOnly>("lastUpdate")
                        .HasColumnType("date");

                    b.HasKey("Id");

                    b.HasIndex("SourceId");

                    b.ToTable("Problem");
                });

            modelBuilder.Entity("BackEnd.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Company")
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("GithubProfile")
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("ImageLink")
                        .HasMaxLength(1000)
                        .HasColumnType("varchar(1000)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.HasKey("Id");

                    b.ToTable("User");
                });

            modelBuilder.Entity("BackEnd.Models.WaitingForApproval", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)");

                    b.Property<int>("userId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("userId");

                    b.ToTable("Waiting");
                });

            modelBuilder.Entity("BackEnd.Models.Comment", b =>
                {
                    b.HasOne("BackEnd.Models.Comment", null)
                        .WithMany("Replies")
                        .HasForeignKey("CommentId");
                });

            modelBuilder.Entity("BackEnd.Models.Problem", b =>
                {
                    b.HasOne("BackEnd.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("SourceId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("User");
                });

            modelBuilder.Entity("BackEnd.Models.WaitingForApproval", b =>
                {
                    b.HasOne("BackEnd.Models.User", "user")
                        .WithMany()
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("user");
                });

            modelBuilder.Entity("BackEnd.Models.Comment", b =>
                {
                    b.Navigation("Replies");
                });
#pragma warning restore 612, 618
        }
    }
}

package com.email.writer.app;

import lombok.Data;

@Data   // this will help to generate getters, setters and constructor
public class EmailRequest {
    String emailContent;
    String tone;
}

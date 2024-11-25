//package com.flowcraft.backend.camunda.handler;
//
//import io.camunda.zeebe.spring.client.annotation.JobWorker;
//import org.springframework.stereotype.Component;
//
//import java.util.Map;
//
//@Component
//public class OutputHandler {
//
//    @JobWorker(type = "output")
//    public void handleOutputJob(Map<String, Object> variables) {
//        String eingabe = (String) variables.get("eingabe");
//        System.out.println("Eingabe: " + eingabe);
//    }
//}
//

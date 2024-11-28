//package com.flowcraft.backend.camunda.handler;
//
//import io.camunda.zeebe.spring.client.annotation.JobWorker;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Component;
//
//import java.util.Map;
//
//@Component
//@Slf4j
//public class TestHandler {
//    @JobWorker(type = "my-service-task")
//    public void handleJob(Map<String, Object> variables) {
//        log.debug("Service Task wurde ausgeführt!");
//        log.debug("Variablen: {}", variables);
//        // Business Logik implementieren
//    }
//}
//

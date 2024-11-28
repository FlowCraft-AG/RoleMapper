//package com.flowcraft.backend.camunda.handler;
//
//import io.camunda.zeebe.spring.client.annotation.JobWorker;
//import org.springframework.stereotype.Component;
//
//import java.util.Map;
//
//@Component
//public class NoteHandler {
//
//    @JobWorker(type = "note")
//    public void handleNoteJob(Map<String, Object> variables) {
//        String gegebeneNote = (String) variables.get("gegebene_note");
//        System.out.println("Gegebene Note: " + gegebeneNote);
//    }
//}
//

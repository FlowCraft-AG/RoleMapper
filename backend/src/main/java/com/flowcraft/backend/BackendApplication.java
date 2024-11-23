package com.flowcraft.backend;

import com.flowcraft.backend.camunda.ServiceTaskWorker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(proxyBeanMethods = false)
@EnableMongoAuditing
@EnableAsync
@Slf4j
@RequiredArgsConstructor
public class BackendApplication implements CommandLineRunner {

    // private final VorgesetzterErmittelnWorker vorgesetzterErmittelnWorker;
    private final ServiceTaskWorker serviceTaskWorker;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run(String... args) {
        log.info("Starte Camunda-Prozessanwendung");
        // vorgesetzterErmittelnWorker.registerWorker();
        serviceTaskWorker.registerWorker();
    }


//    private static void deployBpmnFiles(ZeebeClient client) {
//        File directory = new File("src/main/resources/camunda/");
//
//        if (!directory.exists() || !directory.isDirectory()) {
//            log.warn("BPMN-Verzeichnis nicht gefunden: {}", "src/main/resources/camunda/");
//            return;
//        }
//
//        File[] bpmnFiles = directory.listFiles((dir, name) -> name.endsWith(".bpmn"));
//
//        if (Objects.requireNonNull(bpmnFiles).length == 0) {
//            log.warn("Keine BPMN-Dateien im Verzeichnis: {}", "src/main/resources/camunda/");
//            return;
//        }
//
//        for (File bpmnFile : bpmnFiles) {
//            try {
//                // Neues Deployment mit deployResource
//                DeploymentEvent deployment = client.newDeployResourceCommand()
//                    .addResourceFile(bpmnFile.getAbsolutePath())
//                    .send()
//                    .join();
//
//                log.info("BPMN-Datei erfolgreich deployed: {} - Version: {}",
//                    bpmnFile.getName(),
//                    deployment.getKey());
//            } catch (Exception e) {
//                log.error("Fehler beim Deployen der Datei {}: {}", bpmnFile.getName(), e.getMessage(), e);
//            }
//        }
//    }
}

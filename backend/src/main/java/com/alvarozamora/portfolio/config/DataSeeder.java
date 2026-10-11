package com.alvarozamora.portfolio.config;

import com.alvarozamora.portfolio.entity.AdminUser;
import com.alvarozamora.portfolio.entity.LikeRecord;
import com.alvarozamora.portfolio.entity.Message;
import com.alvarozamora.portfolio.entity.Project;
import com.alvarozamora.portfolio.entity.ServiceEntity;
import com.alvarozamora.portfolio.entity.SiteContent;
import com.alvarozamora.portfolio.entity.SocialLink;
import com.alvarozamora.portfolio.repository.AdminUserRepository;
import com.alvarozamora.portfolio.repository.LikeRecordRepository;
import com.alvarozamora.portfolio.repository.MessageRepository;
import com.alvarozamora.portfolio.repository.ProjectRepository;
import com.alvarozamora.portfolio.repository.ServiceEntityRepository;
import com.alvarozamora.portfolio.repository.SiteContentRepository;
import com.alvarozamora.portfolio.repository.SocialLinkRepository;
import com.alvarozamora.portfolio.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final SiteContentRepository siteContentRepository;
    private final SocialLinkRepository socialLinkRepository;
    private final ServiceEntityRepository serviceEntityRepository;
    private final ProjectRepository projectRepository;
    private final MessageRepository messageRepository;
    private final LikeRecordRepository likeRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        seedAdmin();
        seedContent();
        seedServices();
        seedProjects();
        seedMessagesAndLikes();
    }

    private void seedAdmin() {
        if (adminUserRepository.count() == 0) {
            adminUserRepository.save(AdminUser.builder()
                    .username(adminUsername)
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .build());
            log.info("Admin creado: {}", adminUsername);
        }
    }

    private void seedContent() {
        if (siteContentRepository.existsById(SiteContent.SINGLETON_ID)) {
            return;
        }
        String heroImage = storageService.copyFromClasspath("/seed/hero.jpeg", "hero-inicio.jpeg");
        String aboutImage = storageService.copyFromClasspath("/seed/portfolio-mockup.jpeg", "sobre-mi.jpeg");

        siteContentRepository.save(SiteContent.builder()
                .id(SiteContent.SINGLETON_ID)
                .brandName("Álvaro Zamora")
                .brandTagline("Diseño + Comunicación")
                .logoText("AZ")
                .heroTitle("Ideas que\nse ven.")
                .heroSubtitle("Diseño gráfico y comunicación visual\npara marcas que quieren destacar.")
                .heroImage(heroImage)
                .aboutTitle("Sobre mí")
                .aboutText("Soy Álvaro Zamora, diseñador gráfico y director de arte. Durante más de 10 años ayudo a "
                        + "marcas a construir identidades con carácter: sistemas visuales claros, consistentes y "
                        + "con personalidad propia. Trabajo la estrategia y el detalle por igual, porque una buena "
                        + "idea solo funciona cuando se ve bien.")
                .aboutImage(aboutImage)
                .contactEmail("hola@alvarozamora.design")
                .contactPhone("+34 600 123 456")
                .contactLocation("Madrid, España")
                .footerText("© " + java.time.Year.now().getValue() + " Álvaro Zamora — Diseño + Comunicación. Todos los derechos reservados.")
                .build());

        socialLinkRepository.saveAll(List.of(
                SocialLink.builder().label("Instagram").url("https://instagram.com/").sortOrder(0).build(),
                SocialLink.builder().label("Behance").url("https://behance.net/").sortOrder(1).build(),
                SocialLink.builder().label("LinkedIn").url("https://linkedin.com/").sortOrder(2).build()));
        log.info("Contenido del sitio sembrado");
    }

    private void seedServices() {
        if (serviceEntityRepository.count() > 0) {
            return;
        }
        serviceEntityRepository.saveAll(List.of(
                ServiceEntity.builder().title("Identidad visual")
                        .description("Naming, logotipo, sistema gráfico y manual de marca.")
                        .icon("Aa").sortOrder(1).active(true).build(),
                ServiceEntity.builder().title("Diseño editorial")
                        .description("Revistas, memorias, catálogos y publicaciones impresas.")
                        .icon("▤").sortOrder(2).active(true).build(),
                ServiceEntity.builder().title("Dirección de arte")
                        .description("Concepto, estética y supervisión visual de campañas y sesiones.")
                        .icon("◉").sortOrder(3).active(true).build(),
                ServiceEntity.builder().title("Diseño web & UI")
                        .description("Sitios, landings e interfaces digitales coherentes con la marca.")
                        .icon("▣").sortOrder(4).active(true).build()));
        log.info("Servicios sembrados");
    }

    private void seedProjects() {
        if (projectRepository.count() > 0) {
            return;
        }
        String eye = "/uploads/hero-inicio.jpeg";
        String mockup = "/uploads/sobre-mi.jpeg";

        Project p1 = Project.builder()
                .title("Identidad Nébula")
                .slug("identidad-nebula")
                .category("Identidad")
                .year(2025)
                .description("Sistema de identidad visual completo para una marca de café de especialidad: "
                        + "logotipo, paleta, tipografía y aplicaciones.")
                .coverImage(eye)
                .featured(true)
                .published(true)
                .sortOrder(1)
                .likeCount(0)
                .build();

        Project p2 = Project.builder()
                .title("Revista Kontur")
                .slug("revista-kontur")
                .category("Editorial")
                .year(2024)
                .description("Diseño editorial y artefinal de una revista de cultura visual independiente.")
                .coverImage(mockup)
                .featured(true)
                .published(true)
                .sortOrder(2)
                .likeCount(0)
                .build();

        Project p3 = Project.builder()
                .title("Campaña Órbita")
                .slug("campana-orbita")
                .category("Dirección de arte")
                .year(2025)
                .description("Dirección de arte y piezas gráficas para la campaña de lanzamiento de un producto tecnológico.")
                .coverImage(eye)
                .featured(false)
                .published(true)
                .sortOrder(3)
                .likeCount(0)
                .build();

        Project p4 = Project.builder()
                .title("Web Estudio Lumen")
                .slug("web-estudio-lumen")
                .category("Digital")
                .year(2026)
                .description("Diseño UI/UX y desarrollo del sitio de un estudio de fotografía.")
                .coverImage(mockup)
                .featured(true)
                .published(true)
                .sortOrder(4)
                .likeCount(0)
                .build();

        projectRepository.saveAll(List.of(p1, p2, p3, p4));
        log.info("Proyectos demo sembrados");
    }

    private void seedMessagesAndLikes() {
        if (messageRepository.count() == 0) {
            messageRepository.saveAll(List.of(
                    Message.builder().name("Lucía Fernández").email("lucia@estudiobrand.com")
                            .subject("Presupuesto identidad visual")
                            .body("¡Hola Álvaro! Estamos lanzando una marca de cosmética natural y nos encantaría "
                                    + "contar contigo para la identidad. ¿Podemos hablar esta semana?")
                            .readFlag(false).build(),
                    Message.builder().name("Marcos Díaz").email("marcos@revistakontur.es")
                            .subject("Colaboración editorial")
                            .body("Queremos invitarte a diseñar el número especial de la revista. ¿Te interesa?")
                            .readFlag(false).build(),
                    Message.builder().name("Ana Ruiz").email("ana@lumenstudio.com")
                            .subject("Gracias por la web")
                            .body("La web quedó espectacular, el cliente encantado. ¡Hablamos para el próximo proyecto!")
                            .readFlag(true).build()));
        }
        if (likeRecordRepository.count() == 0) {
            List<Project> projects = projectRepository.findAllByOrderBySortOrderAscCreatedAtDesc();
            if (projects.size() >= 3) {
                likeRecordRepository.saveAll(List.of(
                        LikeRecord.builder().projectId(projects.get(0).getId()).visitorToken("demo-visitor-1").build(),
                        LikeRecord.builder().projectId(projects.get(0).getId()).visitorToken("demo-visitor-2").build(),
                        LikeRecord.builder().projectId(projects.get(0).getId()).visitorToken("demo-visitor-3").build(),
                        LikeRecord.builder().projectId(projects.get(1).getId()).visitorToken("demo-visitor-1").build(),
                        LikeRecord.builder().projectId(projects.get(1).getId()).visitorToken("demo-visitor-4").build(),
                        LikeRecord.builder().projectId(projects.get(2).getId()).visitorToken("demo-visitor-2").build()));
                projects.get(0).setLikeCount(3);
                projects.get(1).setLikeCount(2);
                projects.get(2).setLikeCount(1);
                projectRepository.saveAll(projects);
            }
        }
        log.info("Mensajes y likes demo sembrados");
    }
}

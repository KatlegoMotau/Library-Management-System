FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/book-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8082
EXPOSE 9092

ENTRYPOINT ["java", "-jar", "app.jar"]

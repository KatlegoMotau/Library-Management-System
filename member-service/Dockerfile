# Use Java 21 to run the Spring Boot application
FROM eclipse-temurin:21-jre

# Set the working directory inside the container
WORKDIR /app

# Copy the executable JAR into the container
COPY target/member-service-0.0.1-SNAPSHOT.jar app.jar

# Expose the HTTP and gRPC ports
EXPOSE 8081
EXPOSE 9091

# Start the Member Service
ENTRYPOINT ["java", "-jar", "app.jar"]

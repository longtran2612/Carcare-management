FROM openjdk:11-jre-slim-buster
EXPOSE 5000
VOLUME /tmp
ARG JAR_FILE
COPY ${JAR_FILE} khoa_luan_backend-1.jar
ENTRYPOINT ["java","-jar","/khoa_luan_backend-1.jar"]

#FROM openjdk:8-jdk-alpine AS build
#WORKDIR /workspace/app
#
#COPY . /workspace/app
#RUN --mount=type=cache,target=/root/.gradle ./gradlew clean build
#RUN mkdir -p build/dependency && (cd build/dependency; jar -xf ../libs/*.jar)

# chạy
# docker build -t  khoa_luan_backend-1.jar.
# đổi tên thành s2taaa/carcare
# docker tag hoa_luan_backend-1 s2taaa/carcare
# docker run -p 5000:5000 -t s2taaa/carcare
# tạo repo trên docker hub s2taaa/carcare
# push image lên docker hub
# docker push s2taaa/carcare
# xóa images ở máy mình đi
# docker rmi s2taaa/carcare
# pull image từ dockerhub về máy
# docker pull s2taaa/carcare
# chạy image
# docker run -p 5000:5000 -t s2taaa/carcare
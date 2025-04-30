#include <WiFi.h>
#include <ESP32Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <HTTPClient.h>
#include <WebSocketsServer.h>

// Khởi tạo WebSocket server
WebSocketsServer webSocket = WebSocketsServer(8080);

// Khởi tạo LCD1602 với địa chỉ I2C (thường là 0x27 hoặc 0x3F)
LiquidCrystal_I2C lcd(0x27, 16, 2);

// 🟡 WiFi
const char* ssid = "phamtuu";
const char* password = "123456789";
WiFiServer server(5000);
WiFiClient client;

// Định nghĩa chân servo và khởi tạo đối tượng Servo
#define SERVO 5
Servo doorServo;


// 🟢 Servo quay hướng
Servo servoX, servoY;
const int servoXPin = 13;
const int servoYPin = 33;
int currentAngleX = 90;
int currentAngleY = 60;

// 🔴 Cảm biến siêu âm
#define TRIG_PIN 2
#define ECHO_PIN 4

// 🟠 Servo bắn
#define FIRE_SERVO_PIN 5
#define LED 14
Servo FireServo;

// còi 
#define SIREN_PIN 19  // Chân GPIO điều khiển transistor

// 🟣 API kiểm tra lệnh bắn
const char* serverUrlfire = "http://192.168.83.239:5000/check_fire";

// ⏲️ Đọc cảm biến và HTTP định kỳ
unsigned long lastDistanceReadTime = 0;
unsigned long lastHttpCheckTime = 0;
unsigned long fireStartTime = 0;
const unsigned long distanceReadInterval = 5000;  // 5s
const unsigned long httpCheckInterval = 2000;     // 2s
const unsigned long fireDuration = 3000;          // 3s cho servo bắn


unsigned long lastMoveTime = 0;  // Thời gian chuyển động cuối cùng
const unsigned long idleTime = 5000;  // 5 giây không có chuyển động
unsigned long lastObjectDetectedTime = 0;
bool isObjectDetected = false;  // Biến để theo dõi việc phát hiện vật


bool openCommandReceived = false;

// 📩 Dữ liệu từ socket
String input = "";
bool isFiring = false;

// Hàm xử lý sự kiện WebSocket
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.printf("[%u] Disconnected!\n", num);
            break;
        case WStype_CONNECTED:
            Serial.printf("[%u] Connected!\n", num);
            break;
        case WStype_TEXT:
            Serial.printf("[%u] Received text: %s\n", num, payload);
            String command = String((char*)payload);
            
            if (command == "ArrowUp") {
                Serial.println("Arduino: Di chuyển lên");
                // Di chuyển servoY lên (giảm góc)
                int newAngleY = currentAngleY - 10;
                newAngleY = constrain(newAngleY, 0, 180);
                moveServoSmooth(servoY, currentAngleY, newAngleY);
            }
            else if (command == "ArrowDown") {
                Serial.println("Arduino: Di chuyển xuống");
                // Di chuyển servoY xuống (tăng góc)
                int newAngleY = currentAngleY + 10;
                newAngleY = constrain(newAngleY, 0, 180);
                moveServoSmooth(servoY, currentAngleY, newAngleY);
            }
            else if (command == "ArrowLeft") {
                Serial.println("Arduino: Di chuyển sang trái");
                // Di chuyển servoX sang trái (giảm góc)
                int newAngleX = currentAngleX - 10;
                newAngleX = constrain(newAngleX, 0, 180);
                moveServoSmooth(servoX, currentAngleX, newAngleX);
            }
            else if (command == "ArrowRight") {
                Serial.println("Arduino: Di chuyển sang phải");
                // Di chuyển servoX sang phải (tăng góc)
                int newAngleX = currentAngleX + 10;
                newAngleX = constrain(newAngleX, 0, 180);
                moveServoSmooth(servoX, currentAngleX, newAngleX);
            }
            else if (command == "Space") {
                Serial.println("Arduino: Bắn");
                // Xử lý bắn
                doorServo.write(90); // Mở cửa
                delay(1000);
                doorServo.write(0); // Đóng cửa
            }
            else if (command == "STOP") {
                Serial.println("Arduino: Dừng di chuyển");
                // Không cần xử lý gì thêm vì servo sẽ giữ nguyên vị trí
            }
            break;
    }
}

void setup() {
    Serial.begin(115200);

    // WiFi setup
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\n✅ WiFi connected");
    Serial.println(WiFi.localIP());
    server.begin();

    // Khởi tạo WebSocket
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
    Serial.println("WebSocket server started");

    // Servo setup
    servoX.attach(servoXPin);
    servoY.attach(servoYPin);
    FireServo.attach(FIRE_SERVO_PIN);
    servoX.write(currentAngleX);
    servoY.write(currentAngleY);
    FireServo.write(0);  // Ban đầu đóng

    // servo cho  bắn 
    doorServo.attach(SERVO);

    // Cảm biến
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);

    // LED 
    pinMode(LED, OUTPUT);
    digitalWrite(LED, LOW);

    // còi 
    pinMode(SIREN_PIN, OUTPUT);
    digitalWrite(SIREN_PIN, LOW);  // Bắt đầu với còi tắt

    lcd.init(); // Khởi động LCD
    lcd.clear();
    lcd.backlight(); // Bật đèn nền LCD
    // Hiển thị chuỗi dài trên LCD
    String longText = "    san sang       chien dau !!!";
    displayLongText(longText);

    Serial.println("LCD Displayed");
}

void displayLongText(String text) {
    lcd.clear();
    int maxLength = 16;  // Mỗi dòng LCD có tối đa 16 ký tự
    int textLength = text.length();
    
    // Vòng lặp qua từng phần của chuỗi
    for (int i = 0; i < textLength; i += maxLength) {
        String part = text.substring(i, i + maxLength); // Cắt chuỗi thành đoạn con
        lcd.setCursor(0, i / maxLength);  // Di chuyển con trỏ đến dòng tiếp theo
        lcd.print(part);  // In phần của chuỗi vào LCD
    }
}

// 📏 Đo khoảng cách
float readDistanceCM() {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    long duration = pulseIn(ECHO_PIN, HIGH, 10000); // Giảm timeout xuống 10ms
    float distance = duration * 0.034 / 2;
    return duration > 0 ? distance : -1; // Trả về -1 nếu lỗi
}

// 📌 Di chuyển servo mượt
void moveServoSmooth(Servo& servo, int& currentAngle, int targetAngle) {
    int step = (targetAngle > currentAngle) ? 2 : -2; // Tăng bước lên 5
    while (abs(currentAngle - targetAngle) > 1) {
        currentAngle += step;
        servo.write(currentAngle);
        delay(1); // Giảm delay xuống 1ms
    }
    currentAngle = targetAngle;
    servo.write(currentAngle);
}


void checkFacialRecognition() {
    WiFiClient client = server.available();
    if (client) {
        Serial.println("Nhận khuôn mặt thành công");
        while (client.connected()) {
            if (client.available()) {
                String command = client.readStringUntil('\n');
                command.trim();
                Serial.println(command);
                if (command == "open") {
                    lcd.clear();
                    lcd.print("Open : Success");
                    openCommandReceived = true;
                    openStartTime = millis();
                }
                if (command == "host") {
                    lcd.clear();
                    lcd.print("HOST bat nhac");
                    digitalWrite(LED, HIGH); // Bật đèn LED khi chu nha
                    delay(20000); // bat den 20s
                    digitalWrite(LED, LOW); // Tắt đèn LED khi het 10s
                    lcd.clear();
                    lcd.print("close door");
                }
            }
        }
        client.stop();
        Serial.println("Client disconnected");
    }
}



void loop() {
    unsigned long currentTime = millis();

    // Xử lý WebSocket
    webSocket.loop();

    // 📶 Xử lý kết nối từ client socket (ưu tiên)
    if (!client || !client.connected()) {
        client = server.available();
        if (client) {
            Serial.println("🖥️ Client da ket noi");
            input = "";
        }
    }

    if (client && client.connected()) {
        while (client.available()) {
            char c = client.read();
            if (c == '\n') {
                input.trim();
                if (input.length() > 2 && input.indexOf(',') != -1) {
                    Serial.printf("🕒 Nhận lúc: %lu ms\n", millis());
                    int commaIndex = input.indexOf(',');
                    int offsetX = input.substring(0, commaIndex).toInt();
                    int offsetY = input.substring(commaIndex + 1).toInt();

                    // Hiệu chỉnh dựa trên FOV (60° ngang, 45° dọc)
                    int targetAngleX = currentAngleX + (offsetX * 60.0 / 640.0);
                    int targetAngleY = currentAngleY + (offsetY * 45.0 / 480.0);

                    targetAngleX = constrain(targetAngleX, 0, 180);
                    targetAngleY = constrain(targetAngleY, 0, 180);

                    Serial.printf("🎯 Offset X: %d, Y: %d | Goc X: %d, Y: %d\n", offsetX, offsetY, targetAngleX, targetAngleY);


                     String longText = "   phat hien ke          dich";
                     displayLongText(longText);

                    digitalWrite(LED, HIGH); // Bật đèn LED khi chuyen dong

                    if (abs(targetAngleX - currentAngleX) > 1) {
                        moveServoSmooth(servoX, currentAngleX, targetAngleX);
                    }
                    if (abs(targetAngleY - currentAngleY) > 1) {
                        moveServoSmooth(servoY, currentAngleY, targetAngleY);
                    }

                    currentAngleX = targetAngleX;
                    currentAngleY = targetAngleY;

                    lastMoveTime = millis();  // Cập nhật thời gian khi có chuyển động
                    lastObjectDetectedTime = currentTime; // Cập nhật thời gian phát hiện vật
                    isObjectDetected = true;  // Đánh dấu đã phát hiện vật

                } else {
                    Serial.println("⚠️ Dữ liệu socket không hợp lệ: " + input);
                }
                input = "";
            } else {
                input += c;
            }
        }
    }

    

        // Nếu không phát hiện vật trong 10 giây, tắt đèn và hiển thị "Không phát hiện vật"
        if (isObjectDetected && currentTime - lastObjectDetectedTime > 10000) {
            digitalWrite(LED, LOW);  // Tắt đèn LED
            String noDetectionText = "Khong phat hien ke dich";
            displayLongText(noDetectionText);  // Cập nhật LCD với thông báo "Không phát hiện vật"
            isObjectDetected = false;  // Đánh dấu không còn phát hiện vật
        }
        // còi kêu 
        if (isObjectDetected) {
            digitalWrite(SIREN_PIN, HIGH);  // Bật còi (transistor dẫn)
            delay(2000);
        } else {
            digitalWrite(SIREN_PIN, LOW);   // Tắt còi (transistor không dẫn)
        }



      checkFacialRecognition();


       // xử lý bắn 
        if (openCommandReceived && (millis() - openStartTime < openDuration)) {
        doorServo.write(90); // Open door
          
      } else {
        doorServo.write(0); // Close door
        
         if (openCommandReceived){
          lcd.clear();
          lcd.print("close door");
         }
        openCommandReceived = false;
      }
    

}
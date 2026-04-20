import axios from "axios";

async function sendWhatsAppTest() {
  const BASE_URL = "https://103.229.250.150/unified/v2/send";

  // ✅ EXACT token provided by vendor
  const TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJJbmZpbml0byIsImlhdCI6MTc2OTQzOTQ4Mywic3ViIjoiTGFudmF1c2M4YnV6eWJhejc2ZjF5NnVhIn0.qodIjrG7Ng5PIklQssZquBsHYNtH417yvQazOjuDGVM";

  const FROM_NUMBER = "919391179635";
  const TO_NUMBER = "919963780869";

  const messageId = `${Date.now()}`; // unique string
  const seqId = Date.now(); // ✅ MUST be integer

  console.log(`📤 Sending WhatsApp message to ${TO_NUMBER}`);

  try {
    const response = await axios.post(
      BASE_URL,
      {
        apiver: "1.0",
        whatsapp: {
          ver: "2.0",
          dlr: {
            url: "", // add webhook later
          },
          messages: [
            {
              coding: 1,
              id: messageId,
              msgtype: 2, // TRANS WITH MEDIA
              // type: "image",
              // contenttype: "image/png",
              // mediadata:
              // "https://sample-videos.com/img/Sample-png-image-100kb.png",
              text: "hello",
              addresses: [
                {
                  seq: seqId,
                  to: TO_NUMBER,
                  from: FROM_NUMBER,
                  tag: "",
                },
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`, // ✅ REQUIRED
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    console.log("✅ API Accepted");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Send Failed");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

sendWhatsAppTest();

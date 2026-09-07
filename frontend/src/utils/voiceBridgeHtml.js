/**
 * Tiny HTML page that runs the Web Speech API inside a WebView.
 * Used so Expo Go can get on-device speech-to-text without a custom native module.
 */
export const VOICE_BRIDGE_HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>html,body{margin:0;background:transparent;}</style>
  </head>
  <body>
    <script>
      (function () {
        function post(type, payload) {
          try {
            window.ReactNativeWebView.postMessage(
              JSON.stringify(Object.assign({ type: type }, payload || {}))
            );
          } catch (e) {}
        }

        var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
          post("unsupported", { reason: "no-speech-api" });
          return;
        }

        var rec = new SR();
        rec.lang = "en-IN";
        rec.interimResults = true;
        rec.continuous = false;
        rec.maxAlternatives = 3;

        rec.onstart = function () {
          post("start");
        };
        rec.onspeechstart = function () {
          post("speechstart");
        };
        rec.onspeechend = function () {
          post("speechend");
        };
        rec.onerror = function (event) {
          post("error", { error: (event && event.error) || "unknown" });
        };
        rec.onend = function () {
          post("end");
        };
        rec.onresult = function (event) {
          var interim = "";
          var finalText = "";
          for (var i = event.resultIndex; i < event.results.length; i++) {
            var piece = event.results[i][0].transcript || "";
            if (event.results[i].isFinal) finalText += piece;
            else interim += piece;
          }
          if (interim) post("partial", { text: interim.trim() });
          if (finalText) post("final", { text: finalText.trim() });
        };

        window.__startVoice = function () {
          try {
            rec.start();
            post("requested");
          } catch (err) {
            post("error", { error: String(err && err.message ? err.message : err) });
          }
        };

        window.__stopVoice = function () {
          try {
            rec.stop();
          } catch (e) {}
        };

        post("ready");
      })();
    </script>
  </body>
</html>`;

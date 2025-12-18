import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as powerbi from "powerbi-client";

function App() {
  const reportRef = useRef(null);
  const containerRef = useRef(null);
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function loadReport() {
      const res = await axios.get("https://power-bi-embedded-dashboard.onrender.com/embed-config");

      const embedConfig = {
        type: "report",
        tokenType: powerbi.models.TokenType.Embed,
        accessToken: res.data.embedToken,
        embedUrl: res.data.embedUrl,
        id: res.data.reportId,
        permissions: powerbi.models.Permissions.View, // ✅ safer than All
        settings: {
          panes: {
            filters: { visible: false },
            pageNavigation: { visible: true }
          }
        }
      };

      const powerbiService = new powerbi.service.Service(
        powerbi.factories.hpmFactory,
        powerbi.factories.wpmpFactory,
        powerbi.factories.routerFactory
      );

      // 🔑 RESET container to avoid double embed
      powerbiService.reset(containerRef.current);

      const embeddedReport = powerbiService.embed(
        containerRef.current,
        embedConfig
      );

      reportRef.current = embeddedReport;
      setReport(embeddedReport);
    }

    loadReport();
  }, []); // IMPORTANT: empty dependency array

  return (
    <div>
      <h2>Superstore Power BI Dashboard</h2>

      <div
        ref={containerRef}
        id="reportContainer"
        style={{ height: "600px", width: "100%" }}
      />
    </div>
  );
}

export default App;

# HVAC Decision Analysis Tool

A browser-based tool to financially compare Heat Pump, Hybrid Geothermal, and Full Geothermal HVAC systems using your own vendor quotes.

![image](https://github.com/user-attachments/assets/c032ea5a-c4a7-4fbe-9975-a1187f7109a5)

## 🤔 Why Use This Tool?

Choosing a new HVAC system is a major financial decision. Comparing quotes is difficult when they involve different upfront costs, efficiencies (SEER2, HSPF2, EER, COP), lifespans, and tax credits. This tool cuts through the noise by providing a clear, apples-to-apples financial comparison based on your specific quotes and financial parameters, helping you see the true long-term cost of each option.

---

## ✨ Key Features

* **Interactive 30-Year Cost Projection**: Visualize the lifetime financial impact of each system, including inflation and future replacement costs.
* **In-Depth Financial Analysis**: Automatically calculates Net Present Value (NPV), simple payback periods, and federal tax credits to find the best financial option.
* **Selectable Comparison Baseline**: Choose any heat pump as the baseline to dynamically recalculate all payback and NPV figures against it.
* **Data Management**: Import and export your vendor quotes using a simple CSV file, or use the pre-loaded example data to get started instantly.
* **Fully Customizable**: Adjust financial parameters like electricity rates, inflation, system lifespans, and weather-related penalties to fit your specific situation.

---

## 🚀 How to Use

1.  **Download & Open**: Download the project files and open `index.html` in your web browser. The tool runs completely offline.
2.  **Enter Data**:
    * **The tool loads with example data** so you can see it in action immediately. Edit the values in the vendor cards directly or replace them by using the **"➕ Add ... Quote"** and **"📁 Load Vendor File"** buttons.
    * Adjust all financial and system parameters in the top sections to match your situation.
3.  **Analyze**:
    * Use the **Step 1, 2, and 3** tables to review payback periods and NPV.
    * Use the interactive graph to visualize the best long-term option. Select a new baseline from the dropdown in the "Step 1" section to re-calculate the entire analysis.

---

## 🖼️ Screenshots

**Interactive Graph with Toggles and Payback Line**
![image](https://github.com/user-attachments/assets/ed4990d9-2609-4881-960b-44152ca2e37a)

**Detailed Financial Tables**
![image](https://github.com/user-attachments/assets/7f8d63b3-34b0-4036-9919-729d0b6ffa5a)

---

## 🛠️ Technical Details

* **Frontend**: Plain HTML, CSS, and JavaScript (no frameworks).
* **Charting**: Uses the native HTML5 Canvas API for lightweight and fast graphing.
* **Dependencies**: None. The project is self-contained and runs entirely in your browser with no internet connection required.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/issues).

---

## 📄 License

This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).

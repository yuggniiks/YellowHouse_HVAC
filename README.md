# HVAC Decision Analysis Tool
A browser-based tool to financially compare Heat Pump, Hybrid Geothermal, and Full Geothermal HVAC systems using your own vendor quotes.

![image](https://github.com/user-attachments/assets/c032ea5a-c4a7-4fbe-9975-a1187f7109a5)


## ✨ Key Features
* **Interactive 30-Year Cost Projection**: Visualize the long-term cost of each option.
    * **Toggle Options**: Turn quotes on or off to easily compare different scenarios.
    * **Payback Indicator**: A vertical line automatically shows the break-even point for geothermal systems.
* **Selectable Comparison Baseline**: Use a dropdown to choose which heat pump to compare your geothermal options against.
* **In-Depth Financial Analysis**: Calculates Net Present Value (NPV), simple payback periods, and accounts for federal tax credits.
* **Data Management**: Import/Export your vendor quotes using a simple CSV file.
* **Fully Customizable**: Adjust financial parameters like electricity rates, inflation, and system lifespans.

## 🚀 How to Use

1.  **Download & Open**: Download the project files and open `index.html` in your web browser.
2.  **Enter Data**:
    * Adjust the financial and system parameters to match your situation.
    * Use the **"➕ Add ... Quote"** buttons to enter vendor data manually, or use the **"📁 Load Vendor File"** button to import a CSV.
3.  **Analyze**:
    * Use the tables to review payback periods and NPV.
    * Use the interactive graph to visualize the best long-term option. Select a new baseline from the dropdown in the "Step 1" section to re-calculate the analysis.

## 🖼️ Screenshots

Here you can add more images to showcase specific features.

**Interactive Graph with Toggles and Payback Line**
![image](https://github.com/user-attachments/assets/ed4990d9-2609-4881-960b-44152ca2e37a)


**Detailed Financial Tables**
![image](https://github.com/user-attachments/assets/7f8d63b3-34b0-4036-9919-729d0b6ffa5a)



## 🛠️ Technical Details

* **Frontend**: Plain HTML, CSS, and JavaScript.
* **Charting**: Uses the HTML5 Canvas API for graphing.
* **Dependencies**: None. The project is lightweight and runs entirely offline in your browser.

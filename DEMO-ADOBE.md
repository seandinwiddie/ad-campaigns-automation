# Creative Automation Pipeline - Adobe Assessment Video Script

This script is specifically tailored for the **Adobe Forward Deployed AI Engineer (FDE) Assessment**. It follows the requirements outlined in the "FDE Take-Home Lite" brief, focusing on **Campaign Velocity**, **Brand Consistency**, and **ROI Optimization**.

## References

- [A] [Adobe Job Description (Firefly FDE)](file:///Users/seandinwiddie/GitHub/sdin-business-private/jobs/adobe/Firefly%20FDE.docx.md)
- [B] [FDE Take-Home Assessment Brief](file:///Users/seandinwiddie/GitHub/sdin-business-private/jobs/adobe/FDE%20Take%20Home%20Lite.md)
- [C] [FDE Assessment FAQs](file:///Users/seandinwiddie/GitHub/sdin-business-private/jobs/adobe/FDE%20Take%20Home%20Lite%20FAQs.md)

## Preparation

- Ensure the application is running: `npm run dev` or `docker compose up`. [B: Req "Run locally"]
- Have a valid **Dropbox Access Token** and at least one AI key (**Gemini** or **OpenAI**) ready. [B: Storage "Dropbox"; FAQ: "Any 3rd party tool/API"]
- Have the `briefs/example-brief.json` available (configured with the required ≥2 products). [B: Req "at least two different products"]
- Clear `localStorage` or start in Incognito to show the initial onboarding/settings screen.

---

## Script & Walkthrough (2-3 Minutes)

### 1. Introduction & Problem Statement (0:00 - 0:20)
- **Visual**: Start on the **Settings Screen** (initial state).
- **Audio/Action**: "This is a demonstration of the Creative Automation Pipeline, developed for the Adobe Forward Deployed Engineer assessment [A: JD]. We're addressing the core business goal of accelerating campaign velocity [B: Goal 1] for a global consumer goods company [B: Scenario] by automating the manual creation overload [B: Pain Point 1]."

### 2. Multi-Provider Configuration & API Orchestration (0:20 - 0:45)
- **Visual**: Paste the **Dropbox Token**, **Gemini API Key**, and **OpenAI Fallback Key**. 
- **Action**: Click "Test" for each key. Observe the success feedback, then click "Save Credentials".
- **Audio/Action**: "We start with production-ready credential setup. I've implemented a resilient API orchestration layer [A: Responsibility 2.1]. The app uses Gemini as the primary engine with a robust OpenAI fallback [C: FAQ 'Any 3rd party API']. This demonstrates the hands-on troubleshooting and system integration skills required to manage high-demand AI workloads [A: Responsibility 2.1]."

### 3. Campaign Brief Input (0:45 - 1:15)
- **Visual**: Navigate to the **Home Screen**.
- **Action**: Load the `example-brief.json`. Call out the products: 'EcoBottle', 'SolarCharger', and 'BambooCase'. [B: Req 'at least two products']
- **Audio/Action**: "Our pipeline accepts structured campaign briefs in JSON format [B: Req 'Campaign brief in JSON']. This brief includes the target region, audience, and the core message [B: Req 'Target region/audience/message'], which we will intelligently process to ensure brand consistency across markets [B: Goal 2]."

### 4. Resilient Execution & Localization (1:15 - 1:35)
- **Visual**: Redirect to **Pipeline Screen**.
- **Action**: Click "Run Pipeline for 3 Products". Point to the **Localization** step.
- **Audio/Action**: "As the pipeline starts, the first step is **Automatic Localization** [B: 'Localized is a plus']. We're translating the message for the Mexican market. By automating this, we maximize relevance and personalization [B: Goal 3] while overcoming slow manual cycles [B: Pain Point 3]."

### 5. Parallel Generation & Multimodal AI (1:35 - 2:05)
- **Visual**: Watch progress bars filling in parallel.
- **Audio/Action**: "The system now resolves hero images—either retrieving existing assets or generating new ones using GenAI [B: Req 'Generate new ones when missing']. We are producing creatives for three social formats simultaneously: 1:1, 9:16, and 16:9 [B: Req 'At least three aspect ratios'; C: FAQ 'Standard social formats']. This is true multimodal AI processing for complex content creation [A: Responsibility 2.3]."

### 6. Automated Brand Compliance (2:05 - 2:40)
- **Visual**: Automatically redirect to **Results Screen**.
- **Action**: Point to the **Compliance & Quality Audit** section for one of the Spanish creatives.
- **Audio/Action**: "Beyond generation, we've implemented **Automated Brand Compliance checks** [B: Nice to Have 'Brand compliance checks']. The system uses computer vision to verify brand colors and flags prohibited words in the localized copy [B: Nice to Have 'Legal content checks']. This captures field-proven patterns for scalable quality assurance [A: Responsibility 4.1]."

### 7. Results & Success Metrics (2:40 - 3:00)
- **Visual**: Highlight the **Success Metrics** card (Time Saved / Efficiency Gain).
- **Audio/Action**: "Finally, we see our generated assets organized logically in Dropbox when it is configured, or immediately downloadable from Results when it is not [B: Req 'Organized by product and ratio']. To validate the POC's value, we track the most critical success metrics: time saved, campaigns generated, and overall efficiency [C: FAQ 'What success metrics matter most?']. Thank you."

---

## Adobe Assessment Alignment Matrix

| Assessment Requirement | implementation Feature | Source Citation |
| :--- | :--- | :--- |
| **Campaign Brief (JSON/YAML)** | `loadBrief` Thunk (Supports Both) | [B: Req 1] |
| **Product Multiplicity (≥2)** | Validated `example-brief.json` (3 Products) | [B: Req 2] |
| **Asset Reuse & GenAI Generation** | `pipelineListener` Resolution Logic | [B: Req 4, 5] |
| **Multi-Format Output (Social)** | 1:1, 9:16, 16:9 Aspect Ratios | [B: Req 6, C: FAQ] |
| **Message Overlay** | Canvas Composition Engine | [B: Req 7] |
| **Organized Output Storage** | Dropbox Path Mapping Logic + Results Download Fallback | [B: Storage, Req 9] |
| **Brand & Legal Compliance** | `complianceSlice` color/word detection | [B: Nice to Have] |
| **API Orchestration & Fallback** | `apiSlice` Resilience Logic | [A: Resp 2.1] |
| **Success Metrics Tracking** | ROI / Efficiency Dashboard | [C: FAQ] |
| **Rapid Prototyping Capability** | Full-stack Next.js/Redux MVP | [A: Resp 1.1] |

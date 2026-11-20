# Next steps

I want to get the basic tracking right before adding cloud services or ML.

## 1. Finish the React app
- [x] Apply the changes to the original repository and run `npm ci`.
- [x] Fix any build or lint problems.
- [x] Check cart interactions and tracking in a real browser.
- [x] Confirm no outgoing analytics request occurs without consent.

## 2. Connect measurement tools
- [ ] Create a test GA4 property and GTM container.
- [ ] Wire events using the dataLayer and handle consent properly.
- [ ] Use Tag Assistant to inspect the event flow.
- [ ] Document what happens when a tag is misconfigured.

## 3. Collect and investigate events
- [ ] Build a small FastAPI endpoint and SQL schema.
- [ ] Handle duplicate event IDs and bad payloads.
- [ ] Generate reproducible sample traffic with missing or delayed events.
- [ ] Compare simple alert thresholds to anomaly detection with scikit-learn.

## 4. Deploy and write up results
- [ ] Deploy the API to Azure using student credits and an explicit budget.
- [ ] Set up basic logging and CI checks.
- [ ] Add a diagram, a demo video and a short write-up with actual test results.

## Other ideas for later
- Incident triage with RAG, using fictional logs and runbooks.
- A conversion forecasting simulator with delayed outcomes.

No company data, real payments, or personal data in this project.

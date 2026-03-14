# Mini Project — Full Update Report

Report focus: Who did what, how things were done, completeness level, and when the system can be used 100%.

---

## 1. General completeness level

Login and sign-in on both frontend and backend have achieved their goals and are in place. The student page and goals reached have achieved their goals. The faculty page has achieved its goals. The majority of the backend has achieved its goals. Project setup and coordination are in place: GitHub configured, tasks defined, meetings held. Front and back connection has been verified and integration ensured. Testing and bug fixing for login are ongoing. Everything works locally; deployment is what is left. The server and domain are bought (DigitalOcean and Namecheap); only configuring and deploying properly remains.

---

## 2. Who did what

Frontend:

Tatubu was responsible for the full login and sign-in flow. Tatubu implemented both the frontend (Login and Signup screens) and the backend (auth endpoints, validation, sessions or tokens as per the stack). End-to-end auth from UI to API and the connection between front and back achieved the set goals and is considered done.

Marriam was responsible for the student-facing page and the "goals reached" functionality. Marriam built the student UI and logic (exam, review, goals) so students can use the app and see their progress. The student flows and goals feature achieved the set goals.

Meder was responsible for the faculty and teacher dashboard and related features. Meder implemented the faculty view (teacher dashboard, protected routes for teachers) so faculty can manage and view data. The faculty page achieved its goals.

Backend.

Sunatully was responsible for the majority of the backend work. Sunatully developed the API, database models, business logic, and server-side behaviour (main app, config, routes). Having one person do all the backend alone was hard, so we helped and we did it together.

Manuchehr also contributed on the backend side and ensured it connected properly with the frontend.

Manuchehr. Manuchehr was responsible for task division and ensuring the frontend and backend connect properly. Manuchehr divided the tasks with clear explanations of who does what and ensured front and back connect correctly (API base URL, CORS, env, wiring of login, student, and faculty to the backend). Manuchehr also reduced overall complexity and aimed for a more proper version that is clean and clear, with more focus on the developing process rather than on having a great product; the priority was different, favouring a solid process and a maintainable codebase over feature-heavy delivery.

Asmo (PM). Asmo was responsible for project coordination and GitHub. Asmo conducted three meetings with the whole team, configured the GitHub project (repos, access, structure), and defined and assigned tasks. Coordination and infrastructure achieved their goals.

Bekhan (testing). There were two testers (Bekhan and Atiya); we said they could divide tasks between each other however they wanted, for example one takes front and the other back. Overall Bekhan was doing backend testing and provided testing; based on his tests we found and fixed issues, so testing goals were completed. The only thing left is the deployment part, which is in progress.

Naim was responsible for deployment. Naim worked closely with Manuchehr to have proper deployment of front and back together. All the needed stuff is bought and in place; only configuration and having a proper pipeline is left.

---

## 3. How did what (summary)

Frontend: Tatubu, Marriam, and Meder did the frontend and left the endpoints that were necessary based on Manuchehr’s points. Tatubu implemented login and sign-in; Marriam the student page and "goals reached"; Meder the faculty page. Backend: Sunatully did the majority of the backend. Manuchehr properly connected front and back. Asmo (PM) ran three meetings, set up GitHub, and drove task assignments. Manuchehr defined who does what, ensured frontend and backend integrate correctly, reduced complexity, and kept focus on a clean developing process rather than a great product. Bekhan (testing) tested login and fixed bugs to improve reliability; based on his tests we found and fixed issues, testing goals completed. Naim + Whole team: deployment (server, domain, Railway bought; config and pipeline in progress).

---

## 4. When we can start using it 100%

Based on the goals we had in our meetings, the deployment goal was to make a proper deployment; overall we achieved our put goals. Regarding when to use it 100%: even now, just by running locally. Since this was a two-week project, our goal for proper deployment was not included here; we wanted to deploy properly in the big project instead.

If you want to have a deployment properly and test it, then we have to do the configuring fast. Technically we could go to our Senior Raul to help us configure it faster, but our top goal for this project was learning how to do it ourselves and why to do it like this. We do not want to do it just for a checkbox so that it is marked as finished; we want to learn to do it properly, all of us, since it is the most crucial part. If possible, all instructions for running are in our main repo so you can check and run it locally. If you think it is not convenient and we must deploy so that it is more convenient for you, it will take time; we would prefer, if possible, to show it to you during your arrival locally on one of our laptops instead of you dealing with running the code manually, and have a proper deployment in our main project later.

Naim and Manuchehr wanted to do proper testing of everything by deploying properly. We got an account on DigitalOcean for the server, a domain on Namecheap, and Railway for deploying the database and backend. The configuration is left to be done, but everything now works locally with clean instructions. We wanted to do a more proper deployment and plan to do it for the main project since all the rest is ready; only the configuration and a proper pipeline remain, and as it is our first time it has taken some time.

What we learned: there is no need for a final best deployment first; having deployment for testers to work is enough. In our approach, testers had issues running all the stuff. We had only one backend developer, which was tight, so we had to help him, and because of all of this the deployment was late.

Not finishing the deployment part is not Naim’s issue; if we could have finished it earlier we would have had more time to work with Naim on deployment. As mentioned again, our goal was not to have a deployed version for this project, since we used this project for working as a team, not for delivering a 100% product. Although this product works properly locally, it is just not deployed yet.

---

## 5. Summary table

| Person     | Role / focus              | Deliverable                          | Status        |
|-----------|---------------------------|--------------------------------------|---------------|
| Tatubu    | Auth                      | Login/sign-in (front + back)         | Goals achieved |
| Marriam   | Student experience        | Student page, goals reached          | Goals achieved |
| Meder     | Faculty experience        | Faculty page                         | Goals achieved |
| Sunatully | Backend                   | Majority of backend                  | Goals achieved |
| Asmo      | PM                        | 3 meetings, GitHub, tasks            | Goals achieved |
| Manuchehr | Tasks, integration, backend support | Task division, front–back connection, helped backend | Goals achieved |
| Bekhan    | Testing                   | Testing and bug fixing for login     | In progress   |
| Whole team + Naim | Deployment                | Server and domain bought, worked with Manuchehr; config and pipeline left | In progress   |

---

Report generated from team input. Update this document as completion and ownership change.

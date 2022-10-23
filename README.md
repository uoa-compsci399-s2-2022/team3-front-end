# MTMS Frontend

Marker & Tutor Management System - One COMPSCI399 Project



## Project management tool

We are **notion** to manage our project. https://yogurtsoftware.notion.site/Home-54f80f6bef7a474d93e1f61a590d5ced

## 

## Project overview

Marker & Tutor Management System (MTMS) is an web based tool for managing enrollment of the tutor and markers for the University of Auckland. 



## Technologies used

**Main technology used:** 

-  [vue3](https://github.com/topics/vue3) --- Front-end framework

-  [TypeScript](https://github.com/topics/typescript) --- Programming Language
-  [scss](https://github.com/topics/scss) --- CSS preprocessor 
-  [axios](https://github.com/axios/axios) --- HTTP client
-  [vite](https://github.com/topics/vite) --- build tool
-  [vue-router4](https://router.vuejs.org/) --- router for Vue
-  [element-plus](https://github.com/topics/element-plus)  ---  Vue 3 based component library
-  [pinia2](https://github.com/topics/pinia2) --- data persistence library for Vue 3

**Development dependencies:**

```json
"@intlify/unplugin-vue-i18n": "^0.7.0",
"@types/node": "^18.7.6",
"@vitejs/plugin-vue": "^3.0.3",
"@vitejs/plugin-vue-jsx": "^2.0.1",
"dayjs": "^1.11",
"sass": "^1.54.4",
"sass-loader": "^13.0.2",
"typescript": "^4.6.4",
"unplugin-auto-import": "^0.11.2",
"unplugin-vue-components": "^0.22.4",
"vite": "^3.0.7",
"vite-plugin-pwa": "^0.13.1",
"vue-slicksort": "^2.0.0-alpha.5",
"vue-tsc": "^0.39.5"
```

**Dependencies**

```json
"@element-plus/icons-vue": "^2.0.9",
"@fortawesome/fontawesome-free": "^6.2.0",
"@fortawesome/fontawesome-svg-core": "^6.2.0",
"@fortawesome/free-brands-svg-icons": "^6.2.0",
"@fortawesome/free-regular-svg-icons": "^6.2.0",
"@fortawesome/free-solid-svg-icons": "^6.2.0",
"@fortawesome/vue-fontawesome": "^3.0.1",
"@vueuse/components": "^9.3.1",
"@vueuse/core": "^9.3.1",
"axios": "^0.27.2",
"dayjs": "^1.11",
"echarts": "^5.4.0",
"element-plus": "^2.2.15",
"js-base64": "^3.7.2",
"pinia": "^2.0.21",
"vue": "^3.2.37",
"vue-confetti-explosion": "^1.0.1",
"vue-i18n": "^9.2.2",
"vue-pdf": "^4.3.0",
"vue-router": "^4.1.3",
"vue-slicksort": "^2.0.0-alpha.5",
"vxe-table": "^4.3.5",
"xe-utils": "^3.5.7"
```



## Installation for Development

Clone the repository to your PC

```
git clone https://github.com/uoa-compsci399-s2-2022/team3-front-end.git
```

Enter the project directory

```
cd team3-front-end
```

Install the required dependencies.

*make sure you have installed node.js in order the install dependencies via `npm`*

```
npm install
```

Run the Vite development server. (which will run the script defined in the packge.json)

```
npm run dev
```

## Build for Production

Build the project for production

```
npm run build
```

After running, a static folder dist will be generated in the project root directory, you can deploy this folder to a static web server (Apache2, Nginx and so on)



### Other setup options

`.env.development` you can config baseURL in developing mode.

`.env.production` you can config baseURL in developing mode

If you have Cross Origin Request Blocked problem, you can config the proxy url

<img src=".\public\tutorial-images\image-20221023180008092.png" alt="image-20221023180008092" style="zoom:50%;" />



### Usage examples

**Scenario 1. Administrator want's to add a new term, and a course of that term.**

Step 1

<img src=".\public\tutorial-images\image-20221023180645088.png" alt="image-20221023180008092" style="zoom:50%;" />

<img src=".\public\tutorial-images\image-20221023180840518.png" alt="image-20221023180008092" style="zoom:50%;" />

Step 2



Enter term information and add term

<img src=".\public\tutorial-images\image-20221023181354313.png" alt="image-20221023180008092" style="zoom:50%;" />

Add a new course

<img src=".\public\tutorial-images\image-20221023181741443.png" alt="image-20221023180008092" style="zoom:50%;" />

New Course is added, you can delete / modify or add another course as you wish.

<img src=".\public\tutorial-images\image-20221023182044687.png" alt="image-20221023180008092" style="zoom:50%;" />



## Online Demo

[Click](https://www.uoamtms.com/) to check the demo online!



## Future Work

1. **Automatically assigning function**

   Automatically assigning function is not part of our project, but it can significantly reduce the tutor/marker coordinator's workload. So we will implement this feature in our future work. While the Hungarian algorithm (https://en.wikipedia.org/wiki/Hungarian_algorithm) can solve this feature after modification.The problem is similar to “n agents, m tasks” assignment problem in combinatorics, except that in our case one marker can mark many courses, and one course can have many markers.According to the students on a course of suitability and preferences, it will automatically match work course and time.

2. **Payment Day Email Reminder**

   In the future, we will add automatic email reminders system for tutors and markers so that they can submit their workload before payday. The coordinator can set the number of paydays and dates, as well as how many days to send the email in advance.

3. **In-site Messaging System**

   For a recruitment and administration site, the presence of a messaging system within the site is the icing on the cake, which allows for more accessible communication between students and coordinators. It dramatically simplifies the recruitment steps. In addition, we can also connect it to the email reminder system so that when users are not online, they can receive the reminder email.

## Acknowledgement

1. Many thanks to our Clients: Burkhard and Sudeep,Coordinator: Asma,Tutor: Anshul for all the assistance, feedback and suggestions they have given us throughout the project.
2. Compsci335 The distributed system knowledge taught served as the cornerstone of the front-end end of our project.
3. Compsci345 The knowledge of design principle and UX increases the usability of our website
4. [Pinia documentation](https://pinia.vuejs.org/introduction.html)
5. [Vue3 documentation](https://vuejs.org/)
6. [vue-router documentation](https://router.vuejs.org/installation.html)
7. [Axios Tutorials](https://masteringjs.io/axios)

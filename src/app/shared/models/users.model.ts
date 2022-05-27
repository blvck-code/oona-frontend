export interface UsersModel {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at?: string;
  last_login?: string;
}


// {
//   "count": 18,
//   "next": null,
//   "previous": null,
//   "results": [
//   {
//     "id": "de18cdcd-e666-40fb-a3e2-89e742c19f7e",
//     "first_name": "Maureen",
//     "last_name": "Amoit",
//     "email": "maureen@sayarilabs.com",
//     "created_at": "2022-05-18T10:13:43.469730+03:00",
//     "last_login": null
//   },
//   {
//     "id": "3da8faed-00eb-4138-a950-8e728ca6a127",
//     "first_name": "Maurice",
//     "last_name": "Oluoch",
//     "email": "brianmauriceoluoch2@gmail.com",
//     "created_at": "2022-05-17T15:02:23.917483+03:00",
//     "last_login": "2022-05-18T12:36:18.835539+03:00"
//   },
//   {
//     "id": "2fa36970-2bce-4595-ae9a-0e3a7e68dd24",
//     "first_name": "Felix",
//     "last_name": "Otieno",
//     "email": "felix.otieno@8teq.co.ke",
//     "created_at": "2022-05-17T14:26:38.246503+03:00",
//     "last_login": null
//   },
//   {
//     "id": "626dad9d-a992-40ca-a62f-be05214f5543",
//     "first_name": "sylvia",
//     "last_name": "chovu",
//     "email": "sylvia.chovu@8teq.co.ke",
//     "created_at": "2022-05-17T13:50:16.816381+03:00",
//     "last_login": "2022-05-17T15:50:21.463296+03:00"
//   },
//   {
//     "id": "de24bcf2-edc4-47c0-85ae-1267d3c768b0",
//     "first_name": "sylvia",
//     "last_name": "chovu",
//     "email": "sylvia.chovu@8tea.co.ke",
//     "created_at": "2022-05-17T13:45:55.308751+03:00",
//     "last_login": null
//   },
//   {
//     "id": "ebcf9d47-10c1-42c4-94b9-de23ac30be63",
//     "first_name": "Clifford",
//     "last_name": "Onyonka",
//     "email": "clifford.onyonka@8teq.co.ke",
//     "created_at": "2022-05-17T12:46:21.951505+03:00",
//     "last_login": "2022-05-17T14:37:25.498168+03:00"
//   },
//   {
//     "id": "134e40ba-4f5f-4e2d-8879-5cf1f5455c24",
//     "first_name": "Wesley",
//     "last_name": "Koech",
//     "email": "wesley.kiprop@8teq.co.ke",
//     "created_at": "2022-05-17T12:11:41.492082+03:00",
//     "last_login": "2022-05-17T12:21:22.861575+03:00"
//   },
//   {
//     "id": "f4d01b5e-f6e7-4413-bf00-c4d367cf831f",
//     "first_name": "George",
//     "last_name": "Ogola",
//     "email": "gogola89@gmail.com",
//     "created_at": "2022-05-17T12:05:43.168957+03:00",
//     "last_login": "2022-05-17T12:45:59.901726+03:00"
//   },
//   {
//     "id": "a3b468ef-ddab-48d6-b69a-ec732d41b727",
//     "first_name": "John",
//     "last_name": "Mwangi",
//     "email": "john.mwangi@8teq.co.ke",
//     "created_at": "2022-05-17T12:03:26.559877+03:00",
//     "last_login": "2022-05-17T14:39:24.650297+03:00"
//   },
//   {
//     "id": "cb8f884b-f8cb-482a-a568-9071843f56f8",
//     "first_name": "Bonface",
//     "last_name": "Obilo",
//     "email": "bonface.obilo@8teq.co.ke",
//     "created_at": "2022-05-17T12:00:16.479563+03:00",
//     "last_login": "2022-05-17T12:02:30.504198+03:00"
//   },
//   {
//     "id": "b11384f5-d36e-4e11-bb12-b636c239e1e9",
//     "first_name": "Joan",
//     "last_name": "Yieke",
//     "email": "joan.yieke@8teq.co.ke",
//     "created_at": "2022-05-17T11:44:17.423104+03:00",
//     "last_login": "2022-05-17T11:46:43.121851+03:00"
//   },
//   {
//     "id": "fd6b9fb5-baa7-4a69-82f8-91532ba4404a",
//     "first_name": "Benard",
//     "last_name": "Odhiambo",
//     "email": "odhiambb@gmail.com",
//     "created_at": "2022-05-17T11:11:01.672301+03:00",
//     "last_login": "2022-05-17T11:11:34.159445+03:00"
//   },
//   {
//     "id": "db988df8-aed6-4b08-984a-850fd34f3d9c",
//     "first_name": "Pius",
//     "last_name": "Musyoki",
//     "email": "mark.mumu@8teq.co.ke",
//     "created_at": "2022-05-11T12:22:23.213323+03:00",
//     "last_login": null
//   },
//   {
//     "id": "ada94e68-5f24-4558-bc62-1be41aa0e5f1",
//     "first_name": "Maurice",
//     "last_name": "Oluoch",
//     "email": "maurice.oluoch@8teq.co.ke",
//     "created_at": "2022-05-11T10:14:31.263416+03:00",
//     "last_login": "2022-05-20T11:37:14.820493+03:00"
//   },
//   {
//     "id": "842af24b-16ec-48e6-9dab-008743a15464",
//     "first_name": "Brian",
//     "last_name": "Moenga",
//     "email": "brian.moenga@8teq.co.ke",
//     "created_at": "2022-05-09T12:53:20.541146+03:00",
//     "last_login": null
//   },
//   {
//     "id": "63dae383-7d7a-45dc-a235-bcbf0f21a320",
//     "first_name": "Richard",
//     "last_name": "Otolo",
//     "email": "richardotolo@gmail.com",
//     "created_at": "2022-05-09T11:12:24.648999+03:00",
//     "last_login": "2022-05-17T11:56:38.142425+03:00"
//   },
//   {
//     "id": "aaa9616d-9f23-4408-a358-4f9992744826",
//     "first_name": "Erick",
//     "last_name": "Maina",
//     "email": "erick.maina@8teq.co.ke",
//     "created_at": "2022-05-04T15:16:10.496484+03:00",
//     "last_login": "2022-05-18T16:45:43.604536+03:00"
//   },
//   {
//     "id": "5a140af4-9290-42ab-8a12-48bbc2dc0859",
//     "first_name": "admin",
//     "last_name": "Admin",
//     "email": "admin@admin.com",
//     "created_at": "2022-05-04T14:41:46.652338+03:00",
//     "last_login": "2022-05-18T15:54:32.590206+03:00"
//   }
// ]
// }

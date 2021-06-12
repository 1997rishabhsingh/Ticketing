# Ticketing

Ticketing a project that has been made to depict Microservices architecture running on a Kubernetes Cluster. It makes use of various services (listed below) in order to work.
Each service is containerized using docker and are configured to run inside a kubernetes cluster. All the services communicate via events. 
A user upon successful authentication, can create a ticket, view list of all the available tickets, view a particular ticket and attempt to buy it by making a valid payment.

## Project Structure
The project makes use of the various services to work. All the services are capable of working independently. These services communicate with each other via events. A service upon completion of certain action publishes an event which is then received by any service that is listening for it. Each service wherever required maintains its own copy of database.

| Directory | Service | Description |
| ------ | ------ | ------ |
| auth | Authentication | Responsible for user authentication i.e. login and signup. |
| client | Client | Serves the frontend to the user. |
| common | - | Place for all the common code required by all the service e.g. Custom Events, Errors, etc. Visit [Npm][CommonNPMLink] & [Repository][CommomRepoLink]. |
| Expiration | Expiration | Watches and runs timer for newly created orders. It keeps track of time duration after which an  order expires. |
| infra | - | Contains Kubernetes configration for each service |
| orders | Orders | Creates and updates the orders that are created when a user attempts to buy a ticket. |
| payments | Payments | Responsible for handling payments and charging the user with the price of a ticket. |
| tickets | Tickets | Allows various opertions on the tickets created by the user (e.g. create, update, etc). |
| skaffold.yaml | - | Skaffold configuration to run work on project and run it while in development. |


## Prerequisites
In order to run the project following things are required.
### Tools
- [Docker Desktop][DD]
- [Kubernetes][k8s]
- [NGINX Ingress Controller][NIC]
- [Skaffold]
### Secret Keys
- [Stripe] keys (public and private)

## Project Setup
Once the prerequisites are met, start Docker Desktop and Kubernetes and create the following secrets inside Kubernetes cluster.
### JWT Secret
To create JWT Secret, execute the following command
> kubectl create secret generic jwt-secret --from-literal=JWT_KEY=myjwtsecret

Replace ```myjwtsecret``` with any random string of your choice
### Stripe Secret
Execute the following command to create Stripe secret
> kubectl create secret generic stripe-secret --from-literal=STRIPE_SECRET_KEY=mystripesecret

Replace ```mystripesecret``` with your Stripe Secret key. Login and visit [this][StripeAPIPage] to get your stripe keys.

### Environment Files
Navigate to each directory (corresponding to respective service) and setup the ```.env``` file. Use the ```.env.sample``` file for any reference.

### Edit Host File
Add the following entry at the end of your system's host file.
> 127.0.0.1 ticketing.dev

You can replace ```ticketing.dev``` with domain of your choice. Just make sure you remember it!
This is required since thats how NGINX works. Visit [this][ModifyHostsFile] for more details.

## Running the Project
From the project root directory (i.e. not in any service folder) execute the following command
> skaffold dev

It may take several minutes for the project to run for the first time. Once you see message like
> XYZ service listening on 3000!

from each service, this indicates the project is up and running successfully.
Visit ```ticketing.dev``` or whatever domain you entered in your system's host file during Project Setup in the browser to visit homepage. If you see warning in the browser such as
> Your connection is not private

Type ```thisisunsafe``` while browser is in focus to temporarily get past this warning screen.

## Technologies
- [Docker]
- [Kubernetes]
- [NGINX Ingress Controller][NIC]
- [NodeJS]
- [NextJS]
- [MongoDB]
- [NATS]
- [GitHub Actions]

## License
MIT


   [Docker]: <https://www.docker.com>
   [Kubernetes]: <https://kubernetes.io/>
   [NATS]: <https://github.com/nats-io>
   [NodeJS]: <https://nodejs.org/en/>
   [NextJS]: <https://nextjs.org/>
   [MongoDB]: <https://www.mongodb.com>
   [GitHub Actions]: <https://github.com/features/actions>
   [DD]: <https://www.docker.com/products/docker-desktop>
   [k8s]: <https://docs.docker.com/desktop/kubernetes/>
   [NIC]: <https://kubernetes.github.io/ingress-nginx/deploy/>
   [Skaffold]: <https://skaffold.dev/>
   [Stripe]: <https://stripe.com/>
   [StripeAPIPage]: <https://dashboard.stripe.com/test/apikeys>
   [ModifyHostsFile]: <https://docs.rackspace.com/support/how-to/modify-your-hosts-file/>
   [CommomRepoLink]: <https://github.com/dev-rish/rishtickets-common>
   [CommonNPMLink]: <https://www.npmjs.com/package/@rishtickets/common>

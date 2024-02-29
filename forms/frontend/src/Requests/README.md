## UI Discussion

### Submission form message

- originally had a 5-7 second timeout, however removed in favor of using the same state component to store both messages received from the backend and custom messages such as the request limit message, which we want to persist the entire time so the user is aware why the form is disabled
- Revision 1/28: decided it may be confusing for the form to be disabled despite the success message appearing on the Nth request. Used an approach that allowed multiple messages at a time (one for the successful submission message, another for the reqeust limit message) but decided that this could make the user think their request did not actually go through, so revised to combining success message and a count of remaining requests to the same message

### Request limit

- The form is disabled after a user sends their nth request where n is the request limit of the event
- They will see a successful submission message and the form fields will be disabled, they won't see the request limit reached message until they refresh the page/visit the page at a later date
- I thought about displaying the request limit below the date and above the form, however that would likely incentivize users to not include their name, which is fine, but ideally we get their name to be able to send a more personalized request message and give them a shoutout at the event to encourage dancing.
- There is the option to not set a limit for an event. The number of requests will still be kept track of in a users browser, however, so a limit can be enforced in the future.

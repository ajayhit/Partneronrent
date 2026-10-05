# PartnerOnRent Android app

This is the React Native app built with Expo. It currently loads and displays the experiences from the existing PartnerOnRent API.

## Run locally

1. From the repository root, start the API:

   ```sh
   npm run server
   ```

2. In another terminal, start Expo:

   ```sh
   npm run mobile
   ```

3. Open the project in an Android emulator, or scan the Expo QR code with Expo Go. To launch directly in an already-running Android emulator, use `npm run mobile:android`.

The app uses `http://10.0.2.2:5000/api` by default, which routes to the development computer from the standard Android emulator. For a physical phone, copy `.env.example` to `.env`, set `EXPO_PUBLIC_API_URL` to the computer's LAN address (for example, `http://192.168.1.10:5000/api`), and restart Expo. The phone and computer must be on the same network, and the API port must be reachable from the phone.

For Expo web, the default API URL is `http://localhost:5000/api`.

## Type check

```sh
npx tsc --noEmit
```

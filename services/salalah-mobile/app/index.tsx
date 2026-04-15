/**
 * Index — redirect to the Store landing page.
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/store" />;
}

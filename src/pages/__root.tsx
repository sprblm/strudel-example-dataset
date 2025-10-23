import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Layout } from '@/components/Layout';

/**
 * Root layout shell for route content
 */
export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname
const isSpark = process.env.VITE_BUILD_TARGET === 'spark'

async function getSparkPlugins(): Promise<PluginOption[]> {
  try {
    const { default: sparkPlugin } = await import("@github/spark/spark-vite-plugin");
    const { default: createIconImportProxy } = await import("@github/spark/vitePhosphorIconProxyPlugin");
    return [
      createIconImportProxy() as PluginOption,
      sparkPlugin() as PluginOption,
    ];
  } catch {
    return [];
  }
}

// https://vite.dev/config/
export default defineConfig(async () => {
  const sparkPlugins = isSpark ? await getSparkPlugins() : [];

  return {
    base: process.env.VITE_BASE_PATH || '/',
    plugins: [
      react(),
      tailwindcss(),
      ...sparkPlugins,
    ],
    resolve: {
      alias: {
        '@': resolve(projectRoot, 'src')
      }
    },
  };
});

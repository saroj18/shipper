import { Button } from "@/components/ui/button";
import { Database, Server, Code, Globe, GitBranch, Zap } from "lucide-react";

const Home = () => {
  return (
    <div className="flex-1">
      <section className="relative overflow-hidden bg-black py-24 md:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#61DAFB40,transparent)]"></div>
        <div className="absolute -left-24 top-[40%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_center,#00ED6440,transparent_70%)] blur-xl"></div>
        <div className="absolute -right-24 top-[60%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_center,#33993340,transparent_70%)] blur-xl"></div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Deploy your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400">
              MERN stack
            </span>{" "}
            apps in minutes
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-lg text-gray-300 md:text-xl">
            MERNDeploy provides the fastest way to build, deploy, and scale your
            MongoDB, Express, React, and Node.js applications with zero
            configuration.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 text-2xl px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            >
              Start Deploying
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 text-2xl text-black px-8 border-gray-700  "
            >
              View Documentation
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="rounded-lg border border-gray-800 bg-black/50 p-2 shadow-2xl backdrop-blur">
              <div className="relative aspect-[16/9] overflow-hidden rounded">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-black">
                  {/* MERN Stack Visualization */}
                  <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
                    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
                      <div className="mb-3 rounded-full bg-emerald-900/30 p-3">
                        <Database className="h-14 w-14 text-emerald-500" />
                      </div>
                      <span className="text-lg font-medium text-emerald-500">
                        MongoDB
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all hover:border-gray-500/50 hover:shadow-lg hover:shadow-gray-500/10">
                      <div className="mb-3 rounded-full bg-gray-800/30 p-3">
                        <Server className="h-14 w-14 text-gray-400" />
                      </div>
                      <span className="text-lg font-medium text-gray-400">
                        Express
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
                      <div className="mb-3 rounded-full bg-cyan-900/30 p-3">
                        <Code className="h-12 w-12 text-cyan-400" />
                      </div>
                      <span className="text-lg font-medium text-cyan-400">
                        React
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
                      <div className="mb-3 rounded-full bg-emerald-900/30 p-3">
                        <Server className="h-12 w-12 text-emerald-500" />
                      </div>
                      <span className="text-lg font-medium text-emerald-500">
                        Node.js
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code snippet overlay */}
            <div className="absolute -right-4 -top-4 hidden w-72 rounded-lg border border-gray-800 bg-black p-4 shadow-xl md:block">
              <div className="mb-2 flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-xs text-gray-400">deploy.js</div>
              </div>
              <pre className="text-xs text-gray-300">
                <code>{`// Deploy your MERN app
import { deploy } from 'merndeploy';

deploy({
  mongodb: true,
  express: './server',
  react: './client',
  node: '18.x',
  region: 'auto'
}).then(url => {
  console.log(\`🚀 Deployed: \${url}\`);
});`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

     

      <section className="bg-black py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Everything your MERN stack needs
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              From database connections to frontend optimization, we've got your
              entire stack covered with zero configuration required.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "MongoDB Atlas Integration",
                description:
                  "Connect to your MongoDB Atlas cluster or let us provision one for you automatically.",
                icon: <Database className="h-6 w-6" />,
                color: "emerald",
              },
              {
                title: "Express & Node.js Optimization",
                description:
                  "We automatically optimize your Express routes and Node.js server for production.",
                icon: <Server className="h-6 w-6" />,
                color: "emerald",
              },
              {
                title: "React Build Acceleration",
                description:
                  "Intelligent caching and build optimization for lightning-fast React deployments.",
                icon: <Code className="h-6 w-6" />,
                color: "cyan",
              },
              {
                title: "Global Edge Network",
                description:
                  "Your MERN applications are automatically distributed to our global edge network.",
                icon: <Globe className="h-6 w-6" />,
                color: "cyan",
              },
              {
                title: "Instant Deployments",
                description:
                  "Push to git and see your changes live in seconds, not minutes.",
                icon: <Zap className="h-6 w-6" />,
                color: "emerald",
              },
              {
                title: "Preview Environments",
                description:
                  "Every pull request gets its own preview URL with a complete MERN stack.",
                icon: <GitBranch className="h-6 w-6" />,
                color: "cyan",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-gray-700 hover:bg-gray-900/80"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-${feature.color}-900/20 text-${feature.color}-500 group-hover:bg-${feature.color}-900/30`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-800 bg-black py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Deploy your MERN app in 3 simple steps
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              No complex configuration. No DevOps expertise required.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect your repo",
                description:
                  "Link your GitHub, GitLab, or Bitbucket repository with a single click.",
                color: "emerald",
              },
              {
                step: "02",
                title: "Configure your stack",
                description:
                  "We auto-detect your MERN stack configuration or let you customize it.",
                color: "cyan",
              },
              {
                step: "03",
                title: "Deploy & scale",
                description:
                  "Click deploy and watch your app go live with automatic scaling.",
                color: "emerald",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-gray-800 bg-gray-900/50 p-8"
              >
                <div
                  className={`absolute -top-4 left-4 rounded-full bg-${step.color}-500/10 px-3 py-1 text-sm font-bold text-${step.color}-500`}
                >
                  {step.step}
                </div>
                <h3 className="mb-2 mt-4 text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r text-2xl from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            >
              Start Deploying Now
            </Button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-gray-800 bg-black py-24">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-800 bg-gray-900/50 p-8 text-center backdrop-blur">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Ready to deploy your MERN application?
            </h2>
            <p className="mb-8 text-gray-300">
              Join thousands of developers who deploy and scale their MERN
              applications with confidence.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-12 text-xl px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              >
                Deploy for Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 text-xl text-black px-8 border-gray-700"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

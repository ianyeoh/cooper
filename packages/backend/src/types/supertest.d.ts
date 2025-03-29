import stAgent from "supertest/lib/agent";
import STest from "supertest/lib/test";
import { AgentOptions as STAgentOptions, App } from "supertest/types";

interface Test extends STest {
    authenticate: () => void;
}

declare global {
    namespace supertest {
        interface SuperTestStatic {
            (app: App, options?: STAgentOptions): stAgent;
            Test: Test;
            agent: typeof stAgent &
                ((
                    app?: App,
                    options?: STAgentOptions
                ) => InstanceType<typeof stAgent>);
        }
    }
}

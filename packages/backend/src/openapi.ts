import { contract } from "@cooper/ts-rest/src/contract";
import { generateOpenApi } from "@ts-rest/open-api";
import { PathsObject, OperationObject } from "openapi3-ts";

// Auto-generated Swagger API docs
const openapi = generateOpenApi(
    contract,
    {
        info: { title: "API Documentation", version: "1.0.0" },
    },
    {
        setOperationId: true,
    }
);

function isOperationObject(value: unknown): value is OperationObject {
    return typeof value === "object" && value !== null && "tags" in value;
}

// Group sub-sub-routes in contract as child routes under their parent routes
// https://github.com/ts-rest/ts-rest/issues/680
openapi.paths = Object.entries(openapi.paths).reduce<PathsObject>(
    (paths, [path, definition]) => {
        paths[path] = Object.entries(definition).reduce<
            Record<string, unknown>
        >((newDefinition, [key, value]) => {
            if (isOperationObject(value))
                // Limit tags to 1 so sub-sub-routes are gathered under the parent router
                newDefinition[key] = {
                    ...value,
                    tags: value.tags?.slice(0, 1),
                };
            else newDefinition[key] = value;
            return newDefinition;
        }, {});
        return paths;
    },
    {}
);

export default openapi;

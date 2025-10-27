"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = exports.Resource = void 0;
const common_1 = require("@nestjs/common");
const Resource = (resource) => (0, common_1.SetMetadata)('resource', resource);
exports.Resource = Resource;
const Action = (action) => (0, common_1.SetMetadata)('action', action);
exports.Action = Action;
//# sourceMappingURL=resource.decorator.js.map
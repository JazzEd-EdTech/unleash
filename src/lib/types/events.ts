import { ITag } from './model';

export const APPLICATION_CREATED = 'application-created';
export const FEATURE_CREATED = 'feature-created';
export const FEATURE_DELETED = 'feature-deleted';
export const FEATURE_UPDATED = 'feature-updated';
export const FEATURE_METADATA_UPDATED = 'feature-metadata-updated';
export const FEATURE_PROJECT_CHANGE = 'feature-project-change';
export const FEATURE_ARCHIVED = 'feature-archived';
export const FEATURE_REVIVED = 'feature-revived';
export const FEATURE_IMPORT = 'feature-import';
export const FEATURE_TAGGED = 'feature-tagged';
export const FEATURE_TAG_IMPORT = 'feature-tag-import';
export const FEATURE_STRATEGY_UPDATE = 'feature-strategy-update';
export const FEATURE_STRATEGY_ADD = 'feature-strategy-add';
export const FEATURE_STRATEGY_REMOVE = 'feature-strategy-remove';
export const DROP_FEATURE_TAGS = 'drop-feature-tags';
export const FEATURE_UNTAGGED = 'feature-untagged';
export const FEATURE_STALE_ON = 'feature-stale-on';
export const FEATURE_STALE_OFF = 'feature-stale-off';
export const DROP_FEATURES = 'drop-features';
export const STRATEGY_CREATED = 'strategy-created';
export const STRATEGY_DELETED = 'strategy-deleted';
export const STRATEGY_DEPRECATED = 'strategy-deprecated';
export const STRATEGY_REACTIVATED = 'strategy-reactivated';
export const STRATEGY_UPDATED = 'strategy-updated';
export const STRATEGY_IMPORT = 'strategy-import';
export const DROP_STRATEGIES = 'drop-strategies';
export const CONTEXT_FIELD_CREATED = 'context-field-created';
export const CONTEXT_FIELD_UPDATED = 'context-field-updated';
export const CONTEXT_FIELD_DELETED = 'context-field-deleted';
export const PROJECT_CREATED = 'project-created';
export const PROJECT_UPDATED = 'project-updated';
export const PROJECT_DELETED = 'project-deleted';
export const PROJECT_IMPORT = 'project-import';
export const DROP_PROJECTS = 'drop-projects';
export const TAG_CREATED = 'tag-created';
export const TAG_DELETED = 'tag-deleted';
export const TAG_IMPORT = 'tag-import';
export const DROP_TAGS = 'drop-tags';
export const TAG_TYPE_CREATED = 'tag-type-created';
export const TAG_TYPE_DELETED = 'tag-type-deleted';
export const TAG_TYPE_UPDATED = 'tag-type-updated';
export const TAG_TYPE_IMPORT = 'tag-type-import';
export const DROP_TAG_TYPES = 'drop-tag-types';
export const ADDON_CONFIG_CREATED = 'addon-config-created';
export const ADDON_CONFIG_UPDATED = 'addon-config-updated';
export const ADDON_CONFIG_DELETED = 'addon-config-deleted';
export const DB_POOL_UPDATE = 'db-pool-update';
export const USER_CREATED = 'user-created';
export const USER_UPDATED = 'user-updated';
export const USER_DELETED = 'user-deleted';
export const DROP_ENVIRONMENTS = 'drop-environments';
export const ENVIRONMENT_IMPORT = 'environment-import';
export const FEATURE_ENVIRONMENT_ENABLED = 'feature-environment-enabled';
export const FEATURE_ENVIRONMENT_DISABLED = 'feature-environment-disabled';

export interface ICreateEvent {
    type: string;
    createdBy: string;
    project?: string;
    environment?: string;
    featureName?: string;
    data?: any;
    preData?: any;
    tags?: ITag[];
}

export interface IEvent extends ICreateEvent {
    id: number;
    createdAt: Date;
}

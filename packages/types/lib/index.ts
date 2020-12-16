export type UUID = string;
type Role = "editor" | "reader" | "none";
export type BlockType =
  | "page"
  | "collection_view"
  | "collection_view_page"
  | "header"
  | "text"
  | "sub_header"
  | "sub_sub_header"
  | "image"
  | "bulleted_list"
  | "numbered_list"
  | "divider"
  | "callout"
  | "quote"
  | "code"
  | "factory"
  | "bookmark";
export type DataType =
  | "person"
  | "checkbox"
  | "text"
  | "date"
  | "title"
  | "number"
  | "select"
  | "multi_select"
  | "relation";
type ParentTable = "collection" | "block" | "space";
export type Color = "gray_background";

export interface NotionWrapper<T> {
  role: Role;
  value: T;
}

export interface UserBlockValues {
  id: UUID;
  version: number;
  email: string;
  given_name: string;
  family_name: string;
  profile_photo?: string;
  onboarding_completed: boolean;
  mobile_onboarding_completed: boolean;
}

interface BaseBlockValues {
  id: UUID;
  version: number;
  type: BlockType;
  created_by: UUID;
  created_time: number;
  last_edited_by: UUID;
  last_edited_time: number;
  parent_id: UUID;
  parent_table: ParentTable;
  alive: boolean;
  created_by_id: UUID;
  last_edited_by_id: UUID;
  isRoot: boolean;
}

export interface PageBlockValues extends BaseBlockValues {
  type: "page";
  properties: {
    [k: string]: any[];
  };
  content: UUID[];
  format?: {
    page_icon?: string;
    page_cover?: string;
    page_cover_position?: number;
  };
}

export type TextModifier =
  | ["b"]
  | ["i"]
  | ["c"]
  | ["a", string]
  | ["p", UUID]
  | ["u", UUID];
export type TextSection = [string, TextModifier[]];

interface TextBlockValues<T extends BaseBlockValues["type"] = "text">
  extends BaseBlockValues {
  type: T;
  properties?: {
    title: TextSection[];
  };
}

interface ListBlockValues<T extends "bulleted_list" | "numbered_list">
  extends TextBlockValues<T> {
  content?: UUID[];
}

type HeaderBlockValues = TextBlockValues<"header">;
type SubHeaderBlockValues = TextBlockValues<"sub_header">;
type SubSubHeaderBlockValues = TextBlockValues<"sub_sub_header">;
type BulletedListBlockValues = ListBlockValues<"bulleted_list">;
type NumberedListBlockValues = ListBlockValues<"numbered_list">;
type QuoteBlockValues = TextBlockValues<"quote">;

type CodeLanguage = "JavaScript";
interface CodeBlockValues extends TextBlockValues<"code"> {
  properties?: {
    title: TextSection[];
    language: [CodeLanguage];
  };
}

export interface ImageBlockValues extends BaseBlockValues {
  type: "image";
  properties: {
    source: string[][];
  };
  format: {
    block_width: number;
    display_source: string;
    block_full_width: boolean;
    block_page_width: boolean;
    block_aspect_ratio: number;
    block_preserve_scale: boolean;
  };
}

interface CollectionViewBlockValues extends BaseBlockValues {
  type: "collection_view";
  view_ids: UUID[];
  collection_id: UUID;
}

interface CollectionViewPageBlockValues extends BaseBlockValues {
  type: "collection_view_page";
  view_ids: UUID[];
  collection_id: UUID;
}

interface DividerBlockValues extends BaseBlockValues {
  type: "divider";
}

interface CalloutBlockValues extends TextBlockValues<"callout"> {
  format: {
    block_color: Color;
    page_icon: string;
  };
}

interface FactoryBlockValues extends BaseBlockValues {
  type: "factory";
  content: UUID[];
  properties: {
    title: string[][];
  };
}

export interface BookmarkBlockValues extends BaseBlockValues {
  type: "bookmark";
  properties: {
    link: string[][];
    caption?: string[][];
    title?: string[][];
    description?: string[][];
  };
  format?: {
    bookmark_cover?: string;
  };
}

export type BlockValues =
  | PageBlockValues
  | TextBlockValues
  | HeaderBlockValues
  | SubHeaderBlockValues
  | SubSubHeaderBlockValues
  | ImageBlockValues
  | CollectionViewBlockValues
  | CollectionViewPageBlockValues
  | BulletedListBlockValues
  | NumberedListBlockValues
  | DividerBlockValues
  | CalloutBlockValues
  | QuoteBlockValues
  | CodeBlockValues
  | FactoryBlockValues
  | BookmarkBlockValues;

export type Block = NotionWrapper<BlockValues>;
export type UserBlock = NotionWrapper<Person>;

export interface CollectionSchema {
  [k: string]: { name: string; type: DataType };
}

export interface CollectionFormat {
  collection_page_properties: { visible: boolean; property: string }[];
}

export interface CollectionContent {
  id: UUID;
  version: number;
  name: string[][];
  icon?: string;
  schema: CollectionSchema;
  format: CollectionFormat;
  parent_id: UUID;
  parent_table: ParentTable;
  alive: boolean;
}
export type Collection = NotionWrapper<CollectionContent>;

export interface Aggregate {
  aggregator: string;
  property: string;
}
export interface Filter {
  filter: {
    operator: "enum_is";
    value: {
      type: "exact";
      value: string;
    };
  };
  property: string;
}
export interface Sort {
  direction: "ascending" | "descending";
  property: string;
}

export interface CollectionViewFormat {
  table_wrap: boolean;
  table_properties: { width: number; visible: boolean; property: string }[];
}

export type CollectionView = NotionWrapper<{
  id: UUID;
  version: number;
  type: string;
  name: string;
  query: {
    aggregate: Aggregate[];
  };
  format: CollectionViewFormat;
  parent_id: UUID;
  parent_table: string;
  alive: boolean;
  page_sort: UUID[];
  query2: {
    aggregate: Aggregate[];
    aggregations: { property: string; aggregator: string }[];
  };
}>;

export interface Person {
  id: UUID;
  email: string;
  given_name: string;
  family_name: string;
  profile_photo: string;
}

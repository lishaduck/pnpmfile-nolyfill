import type { Log } from "@pnpm/core-loggers";
import type { CustomFetchers } from "@pnpm/fetcher-base";
import type { PreResolutionHook } from "@pnpm/hooks.types";
import type { LockfileObject } from "@pnpm/lockfile.types";
import type { ImportIndexedPackageAsync } from "@pnpm/store-controller-types";
import type { BaseManifest } from "@pnpm/types";

type Hook<T, Context extends HookContext = HookContext> = T extends Function[]
  ? HookArray<T, Context>
  : T;

type HookArray<
  T extends Function[],
  Context extends HookContext = HookContext
> = T extends [T, infer Tail]
  ? [Tail]
  : [T, ...HookArray<T, ContextOf<Context>>];

type ContextOf<Context> = Context;

export interface HookContext {
  log: (message: string) => void;
}

export type ReadPackageHook = <Pkg extends BaseManifest>(
  pkg: Pkg,
  context: HookContext
) => Pkg | Promise<Pkg>;

declare function Hook1<Pkg extends BaseManifest>(
  pkg: Pkg,
  context: HookContext
): Pkg | Promise<Pkg>;
declare function Hook2<Pkg extends BaseManifest>(
  pkg: Pkg,
  context: HookContext
): Pkg | Promise<Pkg>;

const hooks: Hooks = {
  readPackage: [Hook1, Hook2],
};

interface Hooks_ {
  readPackage?: ReadPackageHook;
  preResolution?: PreResolutionHook;
  afterAllResolved?: (
    lockfile: LockfileObject,
    context: HookContext
  ) => LockfileObject | Promise<LockfileObject>;
  filterLog?: (log: Log) => boolean;
  importPackage?: ImportIndexedPackageAsync;
  fetchers?: CustomFetchers;
  updateConfig?: (config: unknown) => unknown;
}

// TODO: Interface this?
export type Hooks = {
  [H in keyof Omit<Hooks_, "fetchers">]?:
    | Hook<NonNullable<Hooks_[H]>>
    | null
    | undefined;
};

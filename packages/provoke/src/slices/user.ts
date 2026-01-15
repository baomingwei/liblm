import { mchcEnv, mchcLogger } from '@lm_fe/env';
import { IMchc_Group, IMchc_Permission, IMchc_User, SMchc_Common } from '@lm_fe/service';
import { simple_decrypt, simple_encrypt } from '@lm_fe/utils';
import { StateCreator } from 'zustand';
import { MixState } from '../types';


export interface UserInfoState {
  login_name?: string,
  user_info: IMchc_User | null;
  updateUserInfo: (user_info: IMchc_User) => void;
  auth(req: { username: string, password: string }): Promise<string>
  fetch_user(): Promise<IMchc_User>
  permissions: Record<string, IMchc_Permission>

  peek_groups(): IMchc_Group[]
  peek_groups_name(): string[]
  peek_admin(): boolean
}

function arrayToTree<ID extends string, PID extends string, CHILDREN extends string, T extends { [x in (ID | PID)]: number } & { [x in CHILDREN]?: T[] },>(array: T[], id_key: ID, pid_key: PID, children_key: CHILDREN) {
  type XX = T & { isLeaf?: boolean, } & { [x in CHILDREN]: T[] }
  let result: XX[] = [];
  const hash: Record<number, XX> = {};
  const cloned_arr = [...array];

  cloned_arr.forEach((item, index) => {
    const id = item[id_key]

    hash[id] = Object.assign(item, { isLeaf: true, });
  });

  cloned_arr.forEach((item) => {

    const parent = hash[item[pid_key]];
    if (parent) {
      if (!parent[children_key]) {

        parent[children_key] = [] as unknown as Record<number, XX>[T[PID]][CHILDREN]

      }
      parent[children_key].push(item);

      parent['isLeaf'] = false;


    } else {
      result.push(item);
    }
  });
  return result;
}
mchcLogger.log({ simple_decrypt, simple_encrypt })


export const createUserInfoSlice: StateCreator<MixState, [], [], UserInfoState> =
  (set, get) => ({
    user_info: null,
    updateUserInfo: (user_info: IMchc_User) => set({ user_info }),
    permissions: {
      '/': {
        id: 1001,
        type: 'menu',
        key: '/',
        name: '首页',
        parentid: 0,
        active: true,
        icon: 'GithubOutlined',
        sort: -1,
      },
      // '/welcome': {
      //   id: 1002,
      //   type: 'route',
      //   key: '/welcome',
      //   name: '首页',
      //   parentid: 0,
      //   active: true,
      //   icon: 'GithubOutlined',
      //   sort: -1,
      // },
    },
    async auth(req: { username: string, password: string }) {
      const enc = get().config.加密登录
      // const req_data = mchcEnv.in(['南医附属']) ? { data: simple_encrypt(req) } : req
      const req_data = enc ? { data: simple_encrypt(req) } : req
      const token = await SMchc_Common.fk_login(req_data)

      set(s => {
        return { login_name: req.username }
      })
      return token
    },
    async fetch_user() {
      const { user_info, perm_arr } = await SMchc_Common.fk_user()
      const perm_map = Object.fromEntries(perm_arr.map(p => [p.key, p]))
      mchcEnv.user_data = user_info
      set(s => {
        const permissions = { ...s.permissions, ...perm_map }

        // const tree = arrayToTree(Object.values(mix_permissions), 'id', 'parentid', 'children').sort((a, b) => (a.sort - b.sort))

        return { permissions, user_info }
      })
      return user_info
    },

    peek_groups() {
      return this.user_info?.groups ?? []
    },
    peek_groups_name() {
      return this.peek_groups().map(g => g.name.toLowerCase())
    },
    peek_admin() {
      return this.peek_groups_name().includes('admin')
    },

  });

import { defineStore } from 'pinia'
import {useBlogSearchStore} from "./search/useBlogSearchStore.js";
import {useChatStore} from "./chat/chatStore.js";
import {useHomeScrollStore} from "./scroll/UseHomeScrollStore.js";
import {useFollowStore} from "./follow/useFollowStore.js";
import {useLeaveMsgStore} from "./detail/UseLeaveMsgStore.js";
import {useMessageOPStore} from "./chat/UseMessageOPStore.js";
import {useBlogDetailStore} from "./detail/UseBlogDetailStore.js";
import {useMemberSearchStore} from "./search/useMemberSearchStore.js";
import {useScrollStore} from "./honeBlog/ScrollShare.js";
import {publisherMemberIdShare} from "./detail/PublisherMemberIdShare.js";
import {followedMembersStore} from "./follow/FollowedMemberIdsShare.js";
import {drectionStatusStore} from "./honeBlog/DirectionStatusShare.js";
import {homeBlogStore} from "./honeBlog/HomeBlogShared.js";
import {memberBlogShare} from "./member/MemberBlogShare.js";
import {memberEditBlogShare} from "./member/MemberEditBlogShare.js";
import {memberInfoShare} from "./member/MemberInfoShare.js";
import {recoverShare} from "./member/RecoverShare.js";


export const useResetTool = defineStore('useResetTool', () => {

    const blogSearchStore = useBlogSearchStore()
    const chatStore = useChatStore()
    const homeScrollStore = useHomeScrollStore()
    const followStore = useFollowStore()
    const leaveMsgStore = useLeaveMsgStore()
    const messageOPStore = useMessageOPStore()
    const blogDetailStore = useBlogDetailStore()
    const memberSearchStore = useMemberSearchStore()
    const ScrollStore = useScrollStore()
    const publisherMemberStore = publisherMemberIdShare()
    const followedMemberStore = followedMembersStore()
    const derectionStatusStore = drectionStatusStore()
    const homeBlogsStore = homeBlogStore()
    const memberBlogStore = memberBlogShare()
    const memberEditBlogStore = memberEditBlogShare()
    const memberInfoStore = memberInfoShare()
    const recoverStore = recoverShare()

    function reset() {
        blogSearchStore.reset()
        chatStore.reset()
        homeScrollStore.reset()
        followStore.reset()
        leaveMsgStore.reset()
        messageOPStore.reset()
        blogDetailStore.reset()
        memberSearchStore.reset()
        ScrollStore.reset()
        publisherMemberStore.reset()
        followedMemberStore.reset()
        derectionStatusStore.reset()
        homeBlogsStore.reset()
        memberBlogStore.reset()
        memberEditBlogStore.reset()
        memberInfoStore.reset()
        recoverStore.reset();
    }
    return {
        reset
    }
},{

})
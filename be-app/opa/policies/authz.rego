package authz

default allow = false

# 관리자 롤은 모든 요청 허용(샘플)
allow {
  some r
  input.subject.roles[r] == "admin"
}

# 게시물 조회(GET /v1/posts/**)는 모두 허용(샘플)
allow {
  input.action.method == "GET"
  startswith(input.action.path, "/v1/posts")
}


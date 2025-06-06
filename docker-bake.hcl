group "default" {
    targets = ["api", "client"]
}

target "api" {
    context = "."
    dockerfile = "api.Dockerfile"
    tags = ["goiac/donohub-api"]
}

target "client" {
    context = "."
    dockerfile = "client.Dockerfile"
    tags = ["goiac/donohub-client"]
}
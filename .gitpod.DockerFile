FROM gitpod/workspace-full:2024-02-25-19-24-14

SHELL ["/bin/bash", "-c"]
RUN source "/home/gitpod/.sdkman/bin/sdkman-init.sh"  \
    && sdk install java 17.0.4.1-tem < /dev/null
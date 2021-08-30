ARG GO_VERSION="1.14.4"
ARG SINGULARITY_VERSION="3.7.0"

# Build Singularity.
FROM golang:${GO_VERSION}-buster as builder

# Necessary to pass the arg from outside this build (it is defined before the FROM).
ARG SINGULARITY_VERSION

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        cryptsetup \
        libssl-dev \
        uuid-dev \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL "https://github.com/hpcng/singularity/releases/download/v${SINGULARITY_VERSION}/singularity-${SINGULARITY_VERSION}.tar.gz" \
    | tar -xz \
    && cd singularity \
    && ./mconfig -p /usr/local/singularity \
    && cd builddir \
    && make \
    && make install


# Create final image.
# Based on this wonderful work https://github.com/fcwu/docker-ubuntu-vnc-desktop
FROM dorowu/ubuntu-desktop-lxde-vnc:focal

# Install singularity into the final image.
COPY --from=builder /usr/local/singularity /usr/local/singularity



# This bundles all installs to get a faster container build:
# Add Visual Studio code and nextcloud client
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg \
    && mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg \
    && echo "deb [arch=amd64] http://packages.microsoft.com/repos/vscode stable main" | tee /etc/apt/sources.list.d/vs-code.list \
    && add-apt-repository ppa:nextcloud-devs/client

# Add CVMFS
RUN wget https://ecsft.cern.ch/dist/cvmfs/cvmfs-release/cvmfs-release-latest_all.deb \
    && dpkg -i cvmfs-release-latest_all.deb \
    && rm cvmfs-release-latest_all.deb

RUN apt-get update \
    && apt-get install -y \
    lsb-release \
    cvmfs \
    &&  rm -rf /var/lib/apt/lists/*

# configure CVMFS
RUN mkdir -p /etc/cvmfs/keys/ardc.edu.au/ \
    && echo "-----BEGIN PUBLIC KEY-----" | sudo tee /etc/cvmfs/keys/ardc.edu.au/neurodesk.ardc.edu.au.pub \
    && echo "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwUPEmxDp217SAtZxaBep" | sudo tee -a /etc/cvmfs/keys/ardc.edu.au/neurodesk.ardc.edu.au.pub \
    && echo "Bi2TQcLoh5AJ//HSIz68ypjOGFjwExGlHb95Frhu1SpcH5OASbV+jJ60oEBLi3sD" | sudo tee -a /etc/cvmfs/keys/ardc.edu.au/neurodesk.ardc.edu.au.pub \
    && echo "qA6rGYt9kVi90lWvEjQnhBkPb0uWcp1gNqQAUocybCzHvoiG3fUzAe259CrK09qR" | sudo tee -a /etc/cvmfs/keys/ardc.edu.au/neurodesk.ardc.edu.au.pub \
    && echo "pX8sZhgK3eHlfx4ycyMiIQeg66AHlgVCJ2fKa6fl1vnh6adJEPULmn6vZnevvUke" | sudo tee -a /etc/cvmfs/keys/ardc.edu.au/neurodesk.ardc.edu.au.pub \
    && echo "I6U1VcYTKm5dPMrOlY/fGimKlyWvivzVv1laa5TAR2Dt4CfdQncOz+rkXmWjLjkD" | sudo tee -a /etc/cvmfs/keys/ardc.edu.au/neurodesk.ardc.edu.au.pub \
    && echo "87WMiTgtKybsmMLb2yCGSgLSArlSWhbMA0MaZSzAwE9PJKCCMvTANo5644zc8jBe" | sudo tee -a /etc/cvmfs/keys/ardc.edu.au/neurodesk.ardc.edu.au.pub \
    && echo "NQIDAQAB" | sudo tee -a /etc/cvmfs/keys/ardc.edu.au/neurodesk.ardc.edu.au.pub \
    && echo "-----END PUBLIC KEY-----" | sudo tee -a /etc/cvmfs/keys/ardc.edu.au/neurodesk.ardc.edu.au.pub \
    && echo "CVMFS_USE_GEOAPI=yes" | sudo tee /etc/cvmfs/config.d/neurodesk.ardc.edu.au.conf \
    && echo 'CVMFS_SERVER_URL="http://140.238.213.184/cvmfs/@fqrn@;http://132.145.179.103/cvmfs/@fqrn@;http://152.67.101.67/cvmfs/@fqrn@"' | sudo tee -a /etc/cvmfs/config.d/neurodesk.ardc.edu.au.conf \
    && echo 'CVMFS_KEYS_DIR="/etc/cvmfs/keys/ardc.edu.au/"' | sudo tee -a /etc/cvmfs/config.d/neurodesk.ardc.edu.au.conf \
    && echo "CVMFS_HTTP_PROXY=DIRECT" | sudo tee  /etc/cvmfs/default.local \
    && echo "CVMFS_QUOTA_LIMIT=5000" | sudo tee -a  /etc/cvmfs/default.local \
    && cvmfs_config setup 

# Install packages with --no-install-recommends to keep things slim
# 1) singularity's and lmod's runtime dependencies.
# 2) various tools
# 3) julia
# 4) nextcloud-client
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        cryptsetup \
        squashfs-tools \
        lua-bit32 \
        lua-filesystem \
        lua-json \
        lua-lpeg \
        lua-posix \
        lua-term \
        lua5.2 \
        lmod \
        git \
        aria2 \
        code \
        emacs \
        gedit \
        htop \
        imagemagick \
        less \
        nano \
        openssh-client \
        python3-pip \
        rsync \
        screen \
        tree \
        vim \
        gcc \
        python3-dev \
        graphviz \
        libzstd1 \
        libgfortran5 \
        zlib1g-dev \
        zip \
        unzip \
        nextcloud-client \
        iputils-ping \
        sshfs \
    && rm -rf /var/lib/apt/lists/* \
    && rm /etc/apt/sources.list.d/vs-code.list



# add module script
COPY ./config/module.sh /usr/share/

# install nipype
RUN pip3 install nipype \
    && rm -rf /root/.cache/pip \
    && rm -rf /home/ubuntu/.cache/

# setup module system & singularity
COPY ./config/.bashrc /etc/skel/.bashrc
RUN directories=`curl https://raw.githubusercontent.com/NeuroDesk/caid/master/recipes/globalMountPointList.txt` \
    && mounts=`echo $directories | sed 's/ /,/g'` \
    && echo "export SINGULARITY_BINDPATH=${mounts}" >> /etc/skel/.bashrc

# Necessary to pass the args from outside this build (it is defined before the FROM).
ARG GO_VERSION
ARG SINGULARITY_VERSION

ENV PATH="/usr/local/singularity/bin:${PATH}" \
    GO_VERSION=${GO_VERSION} \
    SINGULARITY_VERSION=${SINGULARITY_VERSION} \
    MODULEPATH=/opt/vnm

# configure tiling of windows SHIFT-ALT-CTR-{Left,right,top,Bottom} and other openbox desktop mods
COPY ./config/rc.xml /etc/xdg/openbox

# configure ITKsnap
COPY ./config/.itksnap.org /etc/skel/.itksnap.org
COPY ./config/mimeapps.list /etc/skel/.config/mimeapps.list

# Use custom bottom panel configuration
COPY ./config/panel /etc/skel/.config/lxpanel/LXDE/panels/panel

# Allow the root user to access the sshfs mount
# https://github.com/NeuroDesk/neurodesk/issues/47
RUN sed -i 's/#user_allow_other/user_allow_other/g' /etc/fuse.conf

# Application and submenu icons
WORKDIR /

#RUN git clone https://github.com/NeuroDesk/neurodesk.git /neurodesk
# COPY ./neurodesk /neurodesk

# WORKDIR /neurodesk
# RUN bash build.sh --lxde --edit \
#     && bash install.sh \
#     && ln -s /vnm/containers /neurodesk/local/containers \
#     && mkdir -p /etc/skel/Desktop/ \
#     && ln -s /vnm /etc/skel/Desktop/


# configure where new home-directories are created
# The homedirectory is configured on startup: https://github.com/fcwu/docker-ubuntu-vnc-desktop/blob/develop/rootfs/startup.sh
# COPY ./config/startup.sh /startup.sh

# try to start cvmfs via modified /etc/supervisor/supervisord.conf
COPY ./config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./config/state.py /usr/local/lib/web/backend/vnc/state.py
RUN mkdir /cvmfs/neurodesk.ardc.edu.au
COPY ./config/startup.sh /startup.sh
RUN chmod a+x /startup.sh


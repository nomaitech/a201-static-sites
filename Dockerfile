FROM nginx:1.27-alpine

# Runtime config is provided by Helm-mounted ConfigMaps/PVCs. This image stays
# intentionally thin so content updates do not require a rebuild.
RUN rm -f /etc/nginx/conf.d/default.conf


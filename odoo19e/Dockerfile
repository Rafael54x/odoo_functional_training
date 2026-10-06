# Runtime image for Odoo 19 Enterprise source tree mounted at /opt/odoo19e
FROM odoo:19.0

USER root

# Ensure common tooling available for source extras
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     python3-pip \
     python3-venv \
  && rm -rf /var/lib/apt/lists/*

# Wrapper: prefer mounted Enterprise source if odoo-bin exists there
COPY entrypoint-odoo19e.sh /entrypoint-odoo19e.sh
RUN chmod +x /entrypoint-odoo19e.sh

USER odoo

ENTRYPOINT ["/entrypoint-odoo19e.sh"]
CMD ["odoo"]

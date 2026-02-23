{{- define "shared-static-caddy.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "shared-static-caddy.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "shared-static-caddy.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "shared-static-caddy.labels" -}}
app.kubernetes.io/name: {{ include "shared-static-caddy.name" . }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "shared-static-caddy.selectorLabels" -}}
app.kubernetes.io/name: {{ include "shared-static-caddy.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}


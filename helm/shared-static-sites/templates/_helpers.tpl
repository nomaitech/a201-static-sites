{{- define "shared-static-sites.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "shared-static-sites.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "shared-static-sites.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "shared-static-sites.labels" -}}
app.kubernetes.io/name: {{ include "shared-static-sites.name" . }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "shared-static-sites.selectorLabels" -}}
app.kubernetes.io/name: {{ include "shared-static-sites.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}


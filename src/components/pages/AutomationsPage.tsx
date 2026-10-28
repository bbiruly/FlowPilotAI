import React, { useState } from 'react';
import {
  GitBranch,
  Play,
  Pause,
  Plus,
  Copy,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowDown,
  Sparkles,
  Settings,
  Bot,
  Filter,
  Zap,
  CornerDownRight,
  X,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Workflow, WorkflowNode, WorkflowNodeType } from '../../types';

export const AutomationsPage: React.FC = () => {
  const {
    workflows,
    selectedWorkflowId,
    setSelectedWorkflowId,
    toggleWorkflowStatus,
    updateWorkflow,
    duplicateWorkflow,
    showToast
  } = useApp();

  const currentWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];
  const [editingNode, setEditingNode] = useState<WorkflowNode | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<{ step: string; status: string; time: string }[]>([]);

  const getNodeBadge = (type: WorkflowNodeType) => {
    switch (type) {
      case 'trigger':
        return <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Trigger</span>;
      case 'condition':
        return <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Condition</span>;
      case 'ai_agent':
        return <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded">AI Agent</span>;
      case 'action':
        return <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Action</span>;
      case 'completion':
        return <span className="text-[10px] font-bold uppercase text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Completion</span>;
    }
  };

  const handleSimulateTest = () => {
    setIsSimulating(true);
    setSimulationLogs([]);
    showToast('Simulation Initiated', `Testing ${currentWorkflow.name} with sample event`, 'info');

    const steps = [
      { step: `Event captured: ${currentWorkflow.nodes[0]?.title || 'Incoming Trigger'}`, status: 'PASS', delay: 400 },
      { step: 'Evaluating conditions: Intent detected as high commercial urgency', status: 'PASS', delay: 900 },
      { step: 'Invoking AI Agent with RAG knowledge catalog retrieval', status: 'PASS', delay: 1500 },
      { step: 'Action dispatched: Lead created in CRM (Score: 88, Value: ₹45,000)', status: 'PASS', delay: 2100 },
      { step: 'Completion: Timeline transaction logged. Nudge queued for 48h.', status: 'SUCCESS', delay: 2600 }
    ];

    steps.forEach(({ step, status, delay }) => {
      setTimeout(() => {
        setSimulationLogs(prev => [...prev, { step, status, time: new Date().toLocaleTimeString() }]);
        if (delay === 2600) {
          setIsSimulating(false);
          showToast('Workflow Simulation Passed', 'All 5 nodes executed successfully with zero errors', 'success');
        }
      }, delay);
    });
  };

  const handleSaveNode = () => {
    if (!editingNode) return;
    const updatedNodes = currentWorkflow.nodes.map(n => (n.id === editingNode.id ? editingNode : n));
    updateWorkflow({ ...currentWorkflow, nodes: updatedNodes });
    setEditingNode(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    const updatedNodes = currentWorkflow.nodes.filter(n => n.id !== nodeId);
    updateWorkflow({ ...currentWorkflow, nodes: updatedNodes });
    showToast('Node Removed', 'Workflow step deleted', 'info');
  };

  const handleAddNode = () => {
    const newNode: WorkflowNode = {
      id: 'node-' + Date.now(),
      type: 'action',
      title: 'Dispatch Slack / Email Alert',
      description: 'Sends real-time webhook notification to operations channel.',
      config: { channel: '#ops-alerts' },
      status: 'active'
    };
    updateWorkflow({
      ...currentWorkflow,
      nodes: [...currentWorkflow.nodes.slice(0, -1), newNode, currentWorkflow.nodes.slice(-1)[0]]
    });
    showToast('Node Added', 'New action step inserted before completion', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Automations Builder</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Visual trigger-condition-action pipelines executing autonomous customer ops.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toggleWorkflowStatus(currentWorkflow.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              currentWorkflow.status === 'active'
                ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {currentWorkflow.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{currentWorkflow.status === 'active' ? 'Pause Workflow' : 'Activate Workflow'}</span>
          </button>

          <button
            onClick={() => duplicateWorkflow(currentWorkflow.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={handleSimulateTest}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Simulating Run...' : 'Simulate Test Run'}</span>
          </button>
        </div>
      </div>

      {/* Workflow Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {workflows.map(wf => (
          <button
            key={wf.id}
            onClick={() => setSelectedWorkflowId(wf.id)}
            className={`px-4 py-2.5 rounded-xl border text-left transition-all shrink-0 ${
              wf.id === currentWorkflow.id
                ? 'border-[#635BFF] bg-white ring-2 ring-[#635BFF]/15 shadow-xs'
                : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{wf.name}</span>
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.2 rounded capitalize ${
                  wf.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {wf.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {wf.totalRuns.toLocaleString()} runs · {wf.successRate}% success
            </div>
          </button>
        ))}
      </div>

      {/* Main Canvas: Workflow Sequence & Simulation Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Visual Node Flow (Trigger -> Condition -> AI Agent -> Action -> Completion) */}
        <div className="lg:col-span-2 bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider">
              Workflow Sequence ({currentWorkflow.nodes.length} Steps)
            </span>
            <button
              onClick={handleAddNode}
              className="text-[#635BFF] hover:underline font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Step Node
            </button>
          </div>

          <div className="flex flex-col items-center space-y-3">
            {currentWorkflow.nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setEditingNode(node)}
                  className="w-full max-w-xl p-4 bg-white rounded-xl border border-slate-200 hover:border-[#635BFF] shadow-2xs hover:shadow-xs transition-all cursor-pointer group relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs font-mono font-bold text-slate-600">
                        {index + 1}
                      </div>
                      {getNodeBadge(node.type)}
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#635BFF] transition-colors">
                        {node.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setEditingNode(node);
                        }}
                        className="p-1 hover:text-[#635BFF]"
                        title="Configure Node"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      {currentWorkflow.nodes.length > 2 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteNode(node.id);
                          }}
                          className="p-1 hover:text-rose-600"
                          title="Delete Node"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {node.description}
                  </p>
                </div>

                {index < currentWorkflow.nodes.length - 1 && (
                  <div className="flex flex-col items-center text-slate-400 py-0.5">
                    <div className="w-0.5 h-3 bg-slate-200" />
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Col: Live Simulation Logs & Node Editor */}
        <div className="space-y-4">
          {/* Simulation Output Box */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-lg flex flex-col h-80">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-slate-300 font-mono flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5 text-indigo-400" /> Simulation Terminal
              </span>
              <span className="text-[10px] text-slate-400">
                {isSimulating ? 'Executing...' : 'Ready'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2 font-mono text-[11px]">
              {simulationLogs.length === 0 ? (
                <div className="text-slate-500 italic p-4 text-center">
                  Click "Simulate Test Run" above to trace node execution step-by-step.
                </div>
              ) : (
                simulationLogs.map((log, idx) => (
                  <div key={idx} className="p-2 bg-slate-800/60 rounded border border-slate-800 space-y-0.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">{log.time}</span>
                      <span
                        className={`font-bold ${
                          log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-indigo-400'
                        }`}
                      >
                        [{log.status}]
                      </span>
                    </div>
                    <div className="text-slate-200">{log.step}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Edit Node Drawer / Box */}
          {editingNode && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">Configure Step Node</span>
                <button
                  onClick={() => setEditingNode(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Node Title</label>
                <input
                  type="text"
                  value={editingNode.title}
                  onChange={e => setEditingNode({ ...editingNode, title: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingNode.description}
                  onChange={e => setEditingNode({ ...editingNode, description: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setEditingNode(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNode}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-xs"
                >
                  Update Node
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

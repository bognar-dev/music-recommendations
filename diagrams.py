from graphviz import Digraph


def create_flow_diagram():
    # Create a flow diagram
    dot = Digraph(comment='Album Cover Music Recommendation Process')

    # Adding nodes
    dot.node('A', 'Load Dataset (CSV)', shape='box')
    dot.node('B', 'Download and Preprocess Images', shape='box')
    dot.node('C', 'Extract Features from Album Covers', shape='box')
    dot.node('D', 'Calculate Similarities (Cosine)', shape='box')
    dot.node('E', 'Generate Recommendations', shape='box')
    dot.node('F', 'Display/Return Recommendations', shape='box')

    # Adding edges
    dot.edge('A', 'B', label='Load Data')
    dot.edge('B', 'C', label='Process Images')
    dot.edge('C', 'D', label='Feature Extraction')
    dot.edge('D', 'E', label='Similarity Calculation')
    dot.edge('E', 'F', label='Return Results')

    # Render and display the flow diagram
    dot.render('music_recommendation_flow', format='png', view=True)


# Run the function to create the diagram
create_flow_diagram()


def create_feature_extraction_flow():
    # Create graph with appropriate size and spacing
    dot = Digraph(comment='Feature Extraction Process', 
                  graph_attr={'size': '10,10', 'ranksep': '1.5', 'nodesep': '1'})

    # Define nodes with larger fonts for readability
    dot.node('A', 'Download Image', shape='box', fontsize='32', fontname='Helvetica')
    dot.node('B', 'Preprocess Image', shape='box', fontsize='32', fontname='Helvetica')
    dot.node('C', 'Extract Color Histograms', shape='box', fontsize='32', fontname='Helvetica')
    dot.node('D', 'Extract CNN Features (ResNet, VGG)', shape='box', fontsize='32', fontname='Helvetica')
    dot.node('E', 'Extract Font Features (Optional)', shape='box', fontsize='32', fontname='Helvetica')
    dot.node('F', 'Store Features for Each Song', shape='box', fontsize='32', fontname='Helvetica')

    # Define edges with larger font for clarity
    dot.edge('A', 'B', label='Download', fontsize='24')
    dot.edge('B', 'C', label='Preprocess', fontsize='24')
    dot.edge('B', 'D', label='CNN Feature Extraction', fontsize='24')
    dot.edge('B', 'E', label='Font Feature Extraction (Optional)', fontsize='24')
    dot.edge('C', 'F', label='Store Color Features', fontsize='24')
    dot.edge('D', 'F', label='Store CNN Features', fontsize='24')
    dot.edge('E', 'F', label='Store Font Features', fontsize='24')

    # Render and save the image with better quality and proper DPI scaling
    dot.render('feature_extraction_flow', format='png', view=True, cleanup=True)

# Run the function to create the diagram
create_feature_extraction_flow()


def create_recommendation_flow():
    dot = Digraph(comment='Recommendation Generation Process')

    # Add nodes for each step
    dot.node('A', 'Select Target Song', shape='box')
    dot.node('B', 'Extract Features for Target Song', shape='box')
    dot.node('C', 'Calculate Similarities with Other Songs', shape='box')
    dot.node('D', 'Generate Top N Recommendations', shape='box')
    dot.node('E', 'Return and Display Recommendations', shape='box')

    # Add edges for the flow
    dot.edge('A', 'B', label='Select Target')
    dot.edge('B', 'C', label='Extract Features')
    dot.edge('C', 'D', label='Calculate Cosine Similarities')
    dot.edge('D', 'E', label='Return Top N Songs')

    # Render and display the flow diagram
    dot.render('recommendation_flow', format='png', view=True)


# Run the function to create the diagram
create_recommendation_flow()


def create_feature_comparison_flow():
    dot = Digraph(comment='Feature Comparison Process')

    # Add nodes for each step
    dot.node('A', 'Select Features to Compare', shape='box')
    dot.node('B', 'Extract Selected Features for Songs', shape='box')
    dot.node('C', 'Calculate Cosine Similarity for Each Feature', shape='box')
    dot.node('D', 'Aggregate Similarities', shape='box')
    dot.node('E', 'Generate Final Recommendations', shape='box')

    # Add edges for the flow
    dot.edge('A', 'B', label='Select Features')
    dot.edge('B', 'C', label='Extract Features')
    dot.edge('C', 'D', label='Compute Similarities')
    dot.edge('D', 'E', label='Generate Recommendations')

    # Render and display the flow diagram
    dot.render('feature_comparison_flow', format='png', view=True)


# Run the function to create the diagram
create_feature_comparison_flow()


def main():
    create_feature_extraction_flow()


if __name__ == "__main__":
    main()

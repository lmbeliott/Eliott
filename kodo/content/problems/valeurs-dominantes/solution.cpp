#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> liste(n);
    for (int i = 0; i < n; i++) {
        cin >> liste[i];
    }

    // On parcourt la liste depuis la fin, en gardant le maximum de ce qui suit.
    int plus_grand = -1;
    vector<int> positions;
    for (int i = n - 1; i >= 0; i--) {
        if (liste[i] > plus_grand) {
            positions.push_back(i + 1);
            plus_grand = liste[i];
        }
    }

    // Les positions ont été trouvées de droite à gauche : on les affiche à l'envers.
    cout << positions.size() << "\n";
    for (int k = (int)positions.size() - 1; k >= 0; k--) {
        cout << positions[k];
        if (k > 0) cout << " ";
    }
    cout << "\n";
    return 0;
}

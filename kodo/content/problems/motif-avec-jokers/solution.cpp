#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string t, p;
    cin >> t >> p;
    int n = t.size();
    int m = p.size();

    vector<int> positions;
    for (int i = 0; i + m <= n; i++) {
        // avancer tant que le motif correspond au texte à partir de i
        int j = 0;
        while (j < m && (p[j] == '?' || p[j] == t[i + j])) {
            j = j + 1;
        }
        if (j == m) {
            positions.push_back(i + 1);
        }
    }

    cout << positions.size() << "\n";
    if (positions.size() > 0) {
        for (int k = 0; k < (int) positions.size(); k++) {
            if (k > 0) cout << " ";
            cout << positions[k];
        }
        cout << "\n";
    }
    return 0;
}

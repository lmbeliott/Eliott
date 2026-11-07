#include <iostream>
#include <unordered_set>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    unordered_set<int> vues;
    for (int i = 0; i < n; i++) {
        int v;
        cin >> v;
        if (vues.count(v) > 0) {
            cout << v << " " << i + 1 << "\n";   // position comptée à partir de 1
            return 0;
        }
        vues.insert(v);
    }
    cout << "AUCUNE\n";
    return 0;
}

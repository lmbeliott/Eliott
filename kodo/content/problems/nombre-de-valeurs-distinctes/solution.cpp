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
        vues.insert(v);     // un ensemble ignore les doublons
    }
    cout << vues.size() << "\n";
    return 0;
}

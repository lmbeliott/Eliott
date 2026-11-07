#include <iostream>
#include <queue>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    queue<int> p1, p2;    // du dessus (tête) vers le dessous (queue)
    for (int i = 0; i < n; i++) {
        int c;
        cin >> c;
        p1.push(c);
    }
    for (int i = 0; i < n; i++) {
        int c;
        cin >> c;
        p2.push(c);
    }
    int tours = 0;
    while (!p1.empty() && !p2.empty() && tours < 1000000) {
        int a = p1.front();
        p1.pop();
        int b = p2.front();
        p2.pop();
        if (a > b) {
            p1.push(a);   // sa propre carte d'abord, puis celle de l'adversaire
            p1.push(b);
        } else {
            p2.push(b);
            p2.push(a);
        }
        tours++;
    }
    cout << tours << " " << p1.size() << " " << p2.size() << "\n";
    return 0;
}
